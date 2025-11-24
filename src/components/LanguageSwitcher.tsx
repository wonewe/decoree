import { useEffect, useRef, useState } from "react";
import { SupportedLanguage, useI18n, getLanguageLabel } from "../shared/i18n";

const languages: SupportedLanguage[] = ["en", "fr", "ko", "ja"];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [language]);

  const activeLabel = getLanguageLabel(language);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-[var(--ink)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
          open
            ? "border-[var(--ink)] bg-[var(--paper)] shadow-lg"
            : "border-[var(--border)] bg-[var(--paper)]"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {activeLabel}
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-2 shadow-xl">
          <ul role="listbox" className="space-y-1 text-sm">
            {languages.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={language === code}
                  onClick={() => setLanguage(code)}
                  className={`w-full rounded-xl px-3 py-2 text-left transition ${
                    language === code
                      ? "bg-[var(--ink)] text-white"
                      : "text-[var(--ink-muted)] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {getLanguageLabel(code)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
