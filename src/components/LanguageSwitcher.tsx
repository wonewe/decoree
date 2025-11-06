import { getLanguageLabel, SupportedLanguage, useI18n } from "../shared/i18n";

const languages: SupportedLanguage[] = ["fr", "ko"];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
      {languages.map((code) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
            language === code ? "bg-hanBlue text-white" : "text-slate-600 hover:text-hanBlue"
          }`}
        >
          {getLanguageLabel(code)}
        </button>
      ))}
    </div>
  );
}
