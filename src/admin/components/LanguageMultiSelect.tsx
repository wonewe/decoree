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
      <span className="text-sm font-semibold text-dancheongNavy">{label}</span>
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
                  ? "bg-hanBlue text-white shadow"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-hanBlue hover:text-hanBlue"
              }`}
            >
              {getLanguageLabel(lang)}
            </button>
          );
        })}
      </div>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}


