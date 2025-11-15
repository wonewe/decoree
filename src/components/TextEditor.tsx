import { useRef, useEffect, useCallback, useState } from "react";

type TextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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
  placeholder
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState(300);
  const isInitializedRef = useRef(false);
  const onChangeRef = useRef(onChange);

  // onChange가 변경되어도 에디터에 영향을 주지 않도록 ref로 저장
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 초기값 설정 (한 번만)
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current && initialValue) {
      editorRef.current.textContent = initialValue;
      isInitializedRef.current = true;
    }
  }, [initialValue]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerText || editorRef.current.textContent || "";
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

  const applyFormat = useCallback((command: string, formatValue?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, formatValue);
  }, []);

  return (
    <div className="flex flex-col gap-3">
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
        style={{
          minHeight: `${editorHeight}px`,
          maxHeight: "600px",
          overflowY: "auto"
        }}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed focus:border-hanBlue focus:outline-none focus:ring-2 focus:ring-hanBlue/20"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
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
      `}</style>
    </div>
  );
}

