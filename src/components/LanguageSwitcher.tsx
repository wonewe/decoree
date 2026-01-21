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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
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
        className={`flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 ${
          open
            ? "border-[var(--ink)] bg-[var(--paper-accent)]"
            : "border-[var(--border)] hover:border-[var(--ink)]"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {activeLabel}
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-36 rounded-xl border border-[var(--border)] bg-[var(--paper)] p-1.5 shadow-[var(--shadow-card-hover)]">
          <ul role="listbox" className="space-y-0.5 text-sm">
            {languages.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={language === code}
                  onClick={() => setLanguage(code)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLanguage(code);
                    }
                  }}
                  className={`min-h-[44px] w-full rounded-lg px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 ${
                    language === code
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "text-[var(--ink-muted)] hover:bg-[var(--paper-accent)] hover:text-[var(--ink)]"
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
