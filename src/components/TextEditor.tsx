import { useRef, useEffect, useCallback, useState } from "react";
import { uploadAdminAsset } from "../services/storageService";

type TextEditorProps = {
  label: string;
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
  value: initialValue,
  onChange,
  placeholder,
  imageUploadOptions
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState(300);
  const [uploading, setUploading] = useState(false);
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

  return (
    <div className="flex flex-col gap-3 relative">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-dancheongNavy">{label}</label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1">
          <button
            type="button"
            onClick={() => applyFormat("bold")}
            className="rounded px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
            title="굵게 (Ctrl+B)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => applyFormat("italic")}
            className="rounded px-2 py-1 text-xs italic text-slate-700 hover:bg-slate-100"
            title="기울임 (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => applyFormat("underline")}
            className="rounded px-2 py-1 text-xs underline text-slate-700 hover:bg-slate-100"
            title="밑줄 (Ctrl+U)"
          >
            U
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <button
            type="button"
            onClick={() => applyFormat("formatBlock", "h2")}
            className="rounded px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            title="제목"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => applyFormat("formatBlock", "p")}
            className="rounded px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
            title="본문"
          >
            P
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500">높이</span>
            <button
              type="button"
              onClick={() => setEditorHeight((prev) => Math.max(200, prev - 40))}
              className="rounded px-1 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
              disabled={editorHeight <= 200}
            >
              −
            </button>
            <span className="w-10 text-center text-xs font-semibold text-dancheongNavy">
              {editorHeight}px
            </span>
            <button
              type="button"
              onClick={() => setEditorHeight((prev) => Math.min(600, prev + 40))}
              className="rounded px-1 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
              disabled={editorHeight >= 600}
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
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          minHeight: `${editorHeight}px`,
          maxHeight: "600px",
          overflowY: "auto"
        }}
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed focus:border-hanBlue focus:outline-none focus:ring-2 focus:ring-hanBlue/20 ${
          imageUploadOptions ? "hover:border-hanBlue/50" : ""
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
          <div className="text-sm text-slate-600">이미지 업로드 중...</div>
        </div>
      )}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        [contenteditable] h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem 0;
          color: #1e293b;
        }
        [contenteditable] p {
          margin: 0.5rem 0;
          line-height: 1.6;
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

