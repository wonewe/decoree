import { useCallback, useMemo, useState } from "react";
import type { Phrase, PhraseCategory } from "../data/phrases";
import { fetchPhrases } from "../services/contentService";
import { useAsyncData } from "../hooks/useAsyncData";
import { useI18n } from "../shared/i18n";

const CATEGORY_KEYS: PhraseCategory[] = ["food", "shopping", "entertainment"];

export default function PersonalizedPhrasebook() {
  const { t } = useI18n();
  const [selectedCategories, setSelectedCategories] = useState<PhraseCategory[]>(["food"]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const fetcher = useCallback(() => fetchPhrases(), []);
  const { status, data } = useAsyncData(fetcher);

  const toggleCategory = (category: PhraseCategory) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const filteredPhrases = useMemo(() => {
    if (!data) return [];
    return data.filter((phrase) => selectedCategories.includes(phrase.category));
  }, [data, selectedCategories]);

  const handleMarkCompleted = (phrase: Phrase) => {
    setCompleted((prev) => new Set(prev).add(phrase.id));
    // Placeholders for analytics hooks (e.g., Firestore).
    console.info("Phrase completed:", phrase.id);
  };

  const completionRate = data ? Math.round((completed.size / data.length) * 100) : 0;

  return (
    <section className="section-container space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-dancheongNavy">{t("phrasebook.title")}</h2>
        <p className="max-w-2xl text-slate-600">{t("phrasebook.subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {CATEGORY_KEYS.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedCategories.includes(category)
                ? "bg-dancheongGreen text-white"
                : "bg-white text-slate-600 hover:text-dancheongGreen"
            }`}
          >
            {t(`phrasebook.category.${category}`)}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl bg-white p-6 shadow">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-4 h-6 w-3/5 rounded bg-slate-200" />
              <div className="mt-6 h-4 w-full rounded bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {status === "success" && (
        <>
          <div className="rounded-2xl bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">{t("phrasebook.completed")}</span>
              <span className="text-lg font-bold text-hanBlue">{completionRate}%</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from(completed).map((id) => (
                <span key={id} className="rounded-full bg-hanBlue/10 px-3 py-1 text-xs text-hanBlue">
                  {id}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredPhrases.map((phrase) => (
              <article key={phrase.id} className="card space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase text-slate-400">
                    {t(`phrasebook.category.${phrase.category}`)}
                  </span>
                  <button
                    onClick={() => handleMarkCompleted(phrase)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      completed.has(phrase.id)
                        ? "bg-hanBlue text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-hanBlue/10 hover:text-hanBlue"
                    }`}
                  >
                    {completed.has(phrase.id) ? "✓" : "+"} {t("phrasebook.completed")}
                  </button>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-dancheongNavy">{phrase.korean}</p>
                  <p className="text-sm uppercase tracking-wide text-slate-400">{phrase.transliteration}</p>
                </div>
                <p className="text-slate-600">{phrase.french}</p>
                <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-500">
                  {phrase.culturalNote}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
