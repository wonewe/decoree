import { SupportedLanguage, useI18n } from "../shared/i18n";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  fr: "Français",
  ko: "한국어",
  ja: "日本語"
};

const languages: SupportedLanguage[] = ["fr", "ko", "ja"];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
      {languages.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
          className={`rounded-full px-3 py-1 text-sm font-semibold transition whitespace-nowrap ${
            language === code ? "bg-hanBlue text-white" : "text-slate-600 hover:text-hanBlue"
          }`}
        >
          {LANGUAGE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
