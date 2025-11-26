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
  };

  const completionRate = phrases.length ? Math.round((completed.size / phrases.length) * 100) : 0;
  const showEmpty = status === "success" && phrases.length === 0;
  const showError = status === "error";

  return (
    <section className="section-container space-y-10">
      <div className="content-shell space-y-4">
        <span className="badge-label">{t("phrasebook.title")}</span>
        <h2 className="font-heading text-4xl text-[var(--ink)]">{t("phrasebook.title")}</h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">{t("phrasebook.subtitle")}</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          {CATEGORY_KEYS.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedCategories.includes(category)
                  ? "border-[var(--pill-active-bg)] bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] shadow-sm"
                  : "border-[var(--border)] bg-[var(--paper)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              {t(`phrasebook.category.${category}`)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <label htmlFor="phrase-search" className="sr-only">
            {t("phrasebook.search.label")}
          </label>
          <input
            id="phrase-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("phrasebook.search.placeholder")}
            className="w-full rounded-full border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 pr-12 text-sm focus:border-[var(--ink)] focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-2 flex items-center rounded-full px-3 text-xs font-semibold text-[var(--ink)]"
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
          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--ink-muted)]">
                {t("phrasebook.completed")}
              </span>
              <span className="text-lg font-bold text-[var(--ink)]">{completionRate}%</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from(completed).map((id) => (
                <span key={id} className="rounded-full bg-[var(--accent-muted)] px-3 py-1 text-xs text-[var(--accent)]">
                  {id}
                </span>
              ))}
            </div>
          </div>

          {filteredPhrases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper)] p-6 text-center text-sm text-[var(--ink-subtle)]">
              {t("phrasebook.search.empty")}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPhrases.map((phrase) => (
                <article key={phrase.id} className="card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase text-[var(--ink-subtle)]">
                      {t(`phrasebook.category.${phrase.category}`)}
                    </span>
                    <button
                      onClick={() => handleMarkCompleted(phrase)}
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        completed.has(phrase.id)
                          ? "border-[var(--pill-active-bg)] bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] shadow-sm"
                          : "border-[var(--border)] bg-[var(--paper)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                      }`}
                    >
                      {completed.has(phrase.id) ? "✓" : "+"} {t("phrasebook.completed")}
                    </button>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-[var(--ink)]">{phrase.korean}</p>
                    <p className="text-sm uppercase tracking-wide text-[var(--ink-subtle)]">
                      {phrase.transliteration}
                    </p>
                  </div>
                  <p className="text-[var(--ink-muted)]">{phrase.translation}</p>
                  <div className="rounded-xl bg-[var(--paper-muted)] p-3 text-sm text-[var(--ink-subtle)]">
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
