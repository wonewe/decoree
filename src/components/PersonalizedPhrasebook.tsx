import { useMemo, useState } from "react";
import type { Phrase, PhraseCategory } from "../data/phrases";
import { useI18n } from "../shared/i18n";
import { usePhrasebook } from "../hooks/usePhrasebook";
import { PhraseCardSkeleton } from "./phrasebook/PhraseCardSkeleton";
import { PhraseEmptyState } from "./phrasebook/PhraseEmptyState";

const CATEGORY_KEYS: PhraseCategory[] = ["food", "shopping", "entertainment"];

export default function PersonalizedPhrasebook() {
  const { t, language } = useI18n();
  const [selectedCategories, setSelectedCategories] = useState<PhraseCategory[]>(["food"]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const { status, phrases, error } = usePhrasebook(language);

  const toggleCategory = (category: PhraseCategory) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const filteredPhrases = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return phrases
      .filter((phrase) => selectedCategories.includes(phrase.category))
      .filter((phrase) => {
        if (!normalizedSearch) return true;
        const haystack = [
          phrase.korean,
          phrase.transliteration,
          phrase.translation,
          phrase.culturalNote
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedSearch);
      });
  }, [phrases, selectedCategories, searchTerm]);

  const handleMarkCompleted = (phrase: Phrase) => {
    setCompleted((prev) => new Set(prev).add(phrase.id));
    // Placeholders for analytics hooks (e.g., Firestore).
    console.info("Phrase completed:", phrase.id);
  };

  const completionRate = phrases.length ? Math.round((completed.size / phrases.length) * 100) : 0;
  const showEmpty = status === "success" && phrases.length === 0;
  const showError = status === "error";

  return (
    <section className="section-container space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-dancheongNavy">{t("phrasebook.title")}</h2>
        <p className="max-w-2xl text-slate-600">{t("phrasebook.subtitle")}</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
        <div className="relative w-full md:w-72">
          <label htmlFor="phrase-search" className="sr-only">
            {t("phrasebook.search.label")}
          </label>
          <input
            id="phrase-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("phrasebook.search.placeholder")}
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 pr-12 text-sm shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-2 flex items-center rounded-full px-3 text-xs font-semibold text-slate-400 transition hover:text-hanBlue"
            >
              {t("phrasebook.search.clear")}
            </button>
          )}
        </div>
      </div>

      {status === "loading" && (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <PhraseCardSkeleton key={index} />
          ))}
        </div>
      )}

      {showEmpty && (
        <PhraseEmptyState
          title={t("phrasebook.empty")}
          description={t("phrasebook.subtitle")}
        />
      )}

      {showError && (
        <PhraseEmptyState
          title={t("phrasebook.error")}
          description={error?.message ?? t("phrasebook.subtitle")}
        />
      )}

      {status === "success" && phrases.length > 0 && (
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

          {filteredPhrases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              {t("phrasebook.search.empty")}
            </div>
          ) : (
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
                    <p className="text-sm uppercase tracking-wide text-slate-400">
                      {phrase.transliteration}
                    </p>
                  </div>
                  <p className="text-slate-600">{phrase.translation}</p>
                  <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-500">
                    {phrase.culturalNote}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
