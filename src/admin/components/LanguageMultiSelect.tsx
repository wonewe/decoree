import type { SupportedLanguage } from "../../shared/i18n";
import { getLanguageLabel } from "../../shared/i18n";
import { LANG_OPTIONS } from "../constants";

type LanguageMultiSelectProps = {
  label: string;
  helper?: string;
  value: SupportedLanguage[];
  onChange: (next: SupportedLanguage[]) => void;
};

export function LanguageMultiSelect({ label, helper, value, onChange }: LanguageMultiSelectProps) {
  const toggleLanguage = (lang: SupportedLanguage) => {
    onChange(
      value.includes(lang)
        ? value.filter((item) => item !== lang)
        : [...value, lang]
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[var(--ink)]">{label}</span>
      <div className="flex flex-wrap gap-2">
        {LANG_OPTIONS.map((lang) => {
          const isActive = value.includes(lang);
          return (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                isActive
                  ? "bg-[var(--ink)] text-white shadow"
                  : "border border-[var(--border)] bg-[var(--paper)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              {getLanguageLabel(lang)}
            </button>
          );
        })}
      </div>
      {helper && <p className="text-xs text-[var(--ink-subtle)]">{helper}</p>}
    </div>
  );
}


