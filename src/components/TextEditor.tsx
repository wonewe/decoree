import { useRef, useEffect, useCallback, useState, type ReactNode } from "react";
import { uploadAdminAsset } from "../services/storageService";

type TextEditorProps = {
  label: string;
  labelActions?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // 이미지 업로드를 위한 옵션
  imageUploadOptions?: {
    collection: "events" | "trends" | "phrases" | "popups" | (string & {});
    entityId?: string;
  };
};

/**
 * 포커스 문제를 완전히 해결한 텍스트 에디터
 * - 완전히 uncontrolled로 동작
 * - value prop은 초기값으로만 사용
 * - onChange로 인한 리렌더링이 에디터에 영향을 주지 않음
 */
export default function TextEditor({
  label,
  labelActions,
  value: initialValue,
  onChange,
  placeholder,
  imageUploadOptions
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState(300);
  const [uploading, setUploading] = useState(false);
  const [fontFamily, setFontFamily] = useState("default");
  const [fontSize, setFontSize] = useState("16");
  const isInitializedRef = useRef(false);
  const onChangeRef = useRef(onChange);

  // onChange가 변경되어도 에디터에 영향을 주지 않도록 ref로 저장
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 초기값 설정 (한 번만) - HTML 콘텐츠로 설정
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current && initialValue) {
      // HTML 콘텐츠가 있는지 확인 (이미지 태그 포함)
      if (initialValue.includes("<img") || initialValue.includes("<p>") || initialValue.includes("<h2>")) {
        editorRef.current.innerHTML = initialValue;
      } else {
        // 일반 텍스트인 경우 줄바꿈을 <p> 태그로 변환
        const paragraphs = initialValue.split(/\n+/).filter(p => p.trim());
        if (paragraphs.length > 0) {
          editorRef.current.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join("");
        } else {
          editorRef.current.textContent = initialValue;
        }
      }
      isInitializedRef.current = true;
    }
  }, [initialValue]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    // HTML 콘텐츠를 저장 (이미지 포함)
    const content = editorRef.current.innerHTML || "";
    onChangeRef.current(content);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    if (editorRef.current) {
      document.execCommand("insertText", false, text);
      handleInput();
    }
  }, [handleInput]);

  useEffect(() => {
    // CSS 인라인 스타일이 적용되도록 설정 (미지원 브라우저는 무시)
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {
      // no-op
    }
  }, []);

  // 이미지 삽입 함수
  const insertImage = useCallback(async (file: File) => {
    if (!editorRef.current || !imageUploadOptions) return;

    setUploading(true);
    try {
      // 이미지 업로드
      const { downloadUrl } = await uploadAdminAsset(file, {
        collection: imageUploadOptions.collection,
        entityId: imageUploadOptions.entityId,
        assetType: "inline"
      });

      // 커서 위치에 이미지 삽입
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const img = document.createElement("img");
        img.src = downloadUrl;
        img.alt = file.name;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.margin = "1rem 0";

        const imgContainer = document.createElement("p");
        imgContainer.style.margin = "1rem 0";
        imgContainer.appendChild(img);

        range.insertNode(imgContainer);
        range.setStartAfter(imgContainer);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // 커서가 없으면 끝에 삽입
        const img = document.createElement("img");
        img.src = downloadUrl;
        img.alt = file.name;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.margin = "1rem 0";

        const imgContainer = document.createElement("p");
        imgContainer.style.margin = "1rem 0";
        imgContainer.appendChild(img);

        editorRef.current.appendChild(imgContainer);
      }

      handleInput();
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  }, [imageUploadOptions, handleInput]);

  // 드래그 앤 드롭 처리
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!imageUploadOptions) {
      alert("이미지 업로드가 이 에디터에서 지원되지 않습니다.");
      return;
    }

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    if (files.length === 0) {
      return;
    }

    // 첫 번째 이미지만 업로드 (여러 개는 나중에 지원 가능)
    await insertImage(files[0]);
  }, [imageUploadOptions, insertImage]);

  const applyFormat = useCallback((command: string, formatValue?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, formatValue);
  }, []);

  // 선택 영역 변경 시 툴바 상태 업데이트
  useEffect(() => {
    const updateToolbarState = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const node = selection.anchorNode;
      if (!node || !editorRef.current?.contains(node)) return;

      const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement);
      if (!element) return;

      const computedStyle = window.getComputedStyle(element);

      // 폰트 패밀리 감지
      const family = computedStyle.fontFamily.replace(/['"]/g, "");
      if (family.includes("Merriweather") || family.includes("Georgia") || family.includes("serif")) {
        setFontFamily("serif");
      } else if (family.includes("Menlo") || family.includes("Monaco") || family.includes("monospace")) {
        setFontFamily("mono");
      } else {
        setFontFamily("default");
      }

      // 폰트 크기 감지
      const size = parseInt(computedStyle.fontSize);
      if (!isNaN(size)) {
        // 근사값 찾기 (정확히 일치하지 않을 수 있음)
        const sizes = [14, 16, 18, 20, 24, 30];
        const closest = sizes.reduce((prev, curr) =>
          Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev
        );
        setFontSize(closest.toString());
      }
    };

    document.addEventListener("selectionchange", updateToolbarState);
    return () => document.removeEventListener("selectionchange", updateToolbarState);
  }, []);

  const applyInlineStyle = useCallback(
    (style: { fontFamily?: string; fontSize?: string }) => {
      if (!editorRef.current) return;
      editorRef.current.focus();

      if (style.fontFamily) {
        document.execCommand("fontName", false, style.fontFamily);
      }

      if (style.fontSize) {
        // 1. 임시로 font size 7 (가장 큰 사이즈) 적용
        document.execCommand("fontSize", false, "7");

        // 2. font size 7이 적용된 태그를 찾아서 span으로 교체하고 정확한 pixel size 적용
        const fontElements = editorRef.current.getElementsByTagName("font");
        for (let i = fontElements.length - 1; i >= 0; i--) {
          const font = fontElements[i];
          if (font.getAttribute("size") === "7") {
            const span = document.createElement("span");
            span.style.fontSize = style.fontSize;

            // 기존 font 태그의 내용을 span으로 이동
            while (font.firstChild) {
              span.appendChild(font.firstChild);
            }

            font.replaceWith(span);
          }
        }
      }

      handleInput();
    },
    [handleInput]
  );

  const replaceBlockWithHeading = useCallback((level: number) => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    let block = range.startContainer as HTMLElement | null;
    while (block && block !== editorRef.current && !(block instanceof HTMLParagraphElement) && !(block instanceof HTMLHeadingElement)) {
      block = block.parentElement;
    }
    if (!block || block === editorRef.current) return;

    const heading = document.createElement(`h${Math.min(level, 3)}`);
    heading.textContent = "";
    block.replaceWith(heading);

    const newRange = document.createRange();
    newRange.setStart(heading, 0);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    handleInput();
  }, [handleInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== " ") return;
      const selection = window.getSelection();
      if (!selection || !selection.anchorNode) return;
      const container = selection.anchorNode;
      const text = container.textContent ?? "";
      const trimmed = text.trim();
      if (!/^#{1,3}$/.test(trimmed)) return;
      e.preventDefault();
      const level = trimmed.length;
      replaceBlockWithHeading(level);
    },
    [replaceBlockWithHeading]
  );

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--paper)] shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--paper)] px-4 py-2">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-[var(--ink)]">{label}</label>
          {labelActions && <div className="flex items-center gap-2">{labelActions}</div>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--paper-muted)] p-1">
            <button
              type="button"
              onClick={() => applyFormat("bold")}
              className="rounded px-2 py-1 text-sm font-bold text-[var(--ink)] hover:bg-[var(--paper)] hover:shadow-sm"
              title="Bold (Ctrl+B)"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => applyFormat("italic")}
              className="rounded px-2 py-1 text-sm italic text-[var(--ink)] hover:bg-[var(--paper)] hover:shadow-sm"
              title="Italic (Ctrl+I)"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => applyFormat("underline")}
              className="rounded px-2 py-1 text-sm underline text-[var(--ink)] hover:bg-[var(--paper)] hover:shadow-sm"
              title="Underline (Ctrl+U)"
            >
              U
            </button>
          </div>

          <div className="h-6 w-px bg-[var(--border)]" />

          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--paper-muted)] p-1">
            <button
              type="button"
              onClick={() => applyFormat("formatBlock", "h2")}
              className="rounded px-2 py-1 text-sm font-bold text-[var(--ink)] hover:bg-[var(--paper)] hover:shadow-sm"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => applyFormat("formatBlock", "h3")}
              className="rounded px-2 py-1 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--paper)] hover:shadow-sm"
              title="Heading 3"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => applyFormat("formatBlock", "p")}
              className="rounded px-2 py-1 text-sm text-[var(--ink)] hover:bg-[var(--paper)] hover:shadow-sm"
              title="Paragraph"
            >
              P
            </button>
          </div>

          <div className="h-6 w-px bg-[var(--border)]" />

          <div className="flex items-center gap-2">
            <select
              value={fontFamily}
              onChange={(e) => {
                const value = e.target.value;
                setFontFamily(value);
                const family =
                  value === "default"
                    ? ""
                    : value === "serif"
                      ? "'Merriweather', 'Georgia', serif"
                      : value === "mono"
                        ? "'Menlo', 'Monaco', 'Courier New', monospace"
                        : "'Inter', 'Helvetica Neue', Arial, sans-serif";
                if (family) {
                  applyInlineStyle({ fontFamily: family });
                }
              }}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--paper)] px-2 text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
            >
              <option value="default">Sans-Serif</option>
              <option value="serif">Serif</option>
              <option value="mono">Mono</option>
            </select>

            <select
              value={fontSize}
              onChange={(e) => {
                const value = e.target.value;
                setFontSize(value);
                applyInlineStyle({ fontSize: `${value}px` });
              }}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--paper)] px-2 text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
            >
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
              <option value="24">24px</option>
              <option value="30">30px</option>
            </select>
          </div>

          <div className="h-6 w-px bg-[var(--border)]" />

          <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--paper-muted)] p-1">
            <button
              type="button"
              onClick={() => setEditorHeight((prev) => Math.max(200, prev - 50))}
              className="rounded px-2 py-1 text-xs text-[var(--ink)] hover:bg-[var(--paper)] hover:shadow-sm"
              disabled={editorHeight <= 200}
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setEditorHeight((prev) => Math.min(800, prev + 50))}
              className="rounded px-2 py-1 text-xs text-[var(--ink)] hover:bg-[var(--paper)] hover:shadow-sm"
              disabled={editorHeight >= 800}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          minHeight: `${editorHeight}px`,
          maxHeight: "800px",
          overflowY: "auto"
        }}
        className={`w-full bg-[var(--paper)] px-8 py-8 text-lg leading-loose text-[var(--ink)] focus:outline-none ${imageUploadOptions ? "hover:bg-[var(--paper-hover)]" : ""
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--paper)]/80">
          <div className="text-sm text-[var(--ink-muted)]">이미지 업로드 중...</div>
        </div>
      )}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: var(--ink-subtle);
          pointer-events: none;
        }
        [contenteditable] h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem 0;
          color: var(--ink);
        }
        [contenteditable] p {
          margin: 0.5rem 0;
          line-height: 1.6;
          color: var(--ink-muted);
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1rem 0;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}
