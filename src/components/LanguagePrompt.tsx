import { useEffect, useMemo, useState } from "react";
import { getNavigatorSuggestedLanguage, SupportedLanguage, useI18n } from "../shared/i18n";

const PROMPT_STORAGE_KEY = "koraid.languagePromptSeen";

type LanguagePromptProps = {
  onSelect: (lang: SupportedLanguage) => void;
};

export default function LanguagePrompt({ onSelect }: LanguagePromptProps) {
  const { t, language } = useI18n();
  const [visible, setVisible] = useState(false);
  const [suggested, setSuggested] = useState<SupportedLanguage>(language);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(PROMPT_STORAGE_KEY);
    if (!seen) {
      const suggestedLang = getNavigatorSuggestedLanguage();
      setSuggested(suggestedLang);
      setVisible(true);
    }
  }, []);

  const languages: Array<{ code: SupportedLanguage; label: string }> = useMemo(
    () => [
      { code: "ko", label: "한국어" },
      { code: "fr", label: "Français" },
      { code: "ja", label: "日本語" },
      { code: "en", label: "English" }
    ],
    []
  );

  const handleSelect = (lang: SupportedLanguage) => {
    onSelect(lang);
    setVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROMPT_STORAGE_KEY, "true");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-dancheongNavy">{t("languagePrompt.title")}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {t("languagePrompt.description")} ({suggested.toUpperCase()})
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                item.code === suggested
                  ? "border-hanBlue bg-hanBlue/10 text-hanBlue shadow"
                  : "border-slate-200 text-slate-700 hover:border-hanBlue hover:text-hanBlue"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => handleSelect(language)}
            className="text-sm font-semibold text-slate-500 underline"
          >
            {t("languagePrompt.skip")}
          </button>
        </div>
      </div>
    </div>
  );
}
