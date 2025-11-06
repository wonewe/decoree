import { useEffect, useRef, useState } from "react";
import { SupportedLanguage, useI18n, getLanguageLabel } from "../shared/i18n";

const languages: SupportedLanguage[] = ["fr", "ko", "ja", "en"];

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
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
          open ? "border-hanBlue bg-hanBlue text-white shadow-lg" : "border-slate-200 bg-white"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {activeLabel}
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
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
                      ? "bg-hanBlue text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-hanBlue"
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
