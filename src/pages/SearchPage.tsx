import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { fetchTrendReports, fetchEvents, fetchPopups, fetchPhrases } from "../services/contentService";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  type: "trend" | "event" | "popup" | "phrase";
  link: string;
  meta?: string;
};

const hitMatch = (text: string, query: string) =>
  text.toLowerCase().includes(query.toLowerCase());

export default function SearchPage() {
  const { t, language } = useI18n();
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let cancelled = false;
    const runSearch = async () => {
      if (!hasQuery) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [trends, events, popups, phrases] = await Promise.all([
          fetchTrendReports(language),
          fetchEvents(language),
          fetchPopups(language),
          fetchPhrases(language)
        ]);
        const q = trimmedQuery;
        const hits: SearchResult[] = [];

        trends.forEach((item) => {
          if (
            hitMatch(item.title, q) ||
            hitMatch(item.summary ?? "", q) ||
            item.tags?.some((tag) => hitMatch(tag, q))
          ) {
            hits.push({
              id: `trend-${item.id}`,
              title: item.title,
              description: item.summary ?? item.details ?? "",
              type: "trend",
              link: `/trends/${item.id}`,
              meta: item.neighborhood
            });
          }
        });

        events.forEach((item) => {
          if (
            hitMatch(item.title, q) ||
            hitMatch(item.description ?? "", q) ||
            hitMatch(item.location ?? "", q) ||
            hitMatch(item.category ?? "", q)
          ) {
            hits.push({
              id: `event-${item.id}`,
              title: item.title,
              description: item.description,
              type: "event",
              link: `/events/${item.id}`,
              meta: item.location
            });
          }
        });

        popups.forEach((item) => {
          const tagMatch = item.tags?.some((tag) => hitMatch(tag, q));
          if (
            hitMatch(item.title, q) ||
            hitMatch(item.description ?? "", q) ||
            hitMatch(item.brand ?? "", q) ||
            tagMatch
          ) {
            hits.push({
              id: `popup-${item.id}`,
              title: item.title,
              description: item.description,
              type: "popup",
              link: `/popups/${item.id}`,
              meta: item.location
            });
          }
        });

        phrases.forEach((item) => {
          if (
            hitMatch(item.korean ?? "", q) ||
            hitMatch(item.transliteration ?? "", q) ||
            hitMatch(item.translation ?? "", q) ||
            hitMatch(item.culturalNote ?? "", q) ||
            hitMatch(item.category ?? "", q)
          ) {
            hits.push({
              id: `phrase-${item.id}`,
              title: item.translation,
              description: item.culturalNote ?? "",
              type: "phrase",
              link: `/phrasebook`,
              meta: item.korean
            });
          }
        });

        if (!cancelled) {
          setResults(hits);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [language, trimmedQuery]);

  const grouped = useMemo(() => {
    const byType: Record<SearchResult["type"], SearchResult[]> = {
      trend: [],
      event: [],
      popup: [],
      phrase: []
    };
    results.forEach((hit) => byType[hit.type].push(hit));
    return byType;
  }, [results]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (trimmedQuery) next.set("q", trimmedQuery);
      else next.delete("q");
      return next;
    });
  };

  return (
    <section className="section-container space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-hanBlue">
          {t("search.title")}
        </p>
        <h1 className="text-3xl font-bold text-dancheongNavy">{t("search.headline")}</h1>
        <p className="text-slate-600">{t("search.subtitle")}</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm md:flex-row md:items-center"
      >
        <label className="text-sm font-semibold text-slate-700 md:w-40" htmlFor="search-query">
          {t("hero.search.label")}
        </label>
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
          <input
            id="search-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("hero.search.placeholder")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-inner outline-none ring-1 ring-slate-100 transition focus:border-hanBlue focus:ring-hanBlue/30"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-hanBlue px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-hanBlue/90 disabled:opacity-60"
            disabled={!trimmedQuery}
          >
            {t("hero.search.cta")}
          </button>
        </div>
      </form>

      {!hasQuery && <p className="text-sm text-slate-500">{t("search.emptyPrompt")}</p>}
      {error && <p className="text-sm text-dancheongRed">⚠️ {error}</p>}
      {isLoading && <p className="text-sm text-slate-500">{t("search.loading")}</p>}

      {hasQuery && !isLoading && !error && results.length === 0 && (
        <p className="text-sm text-slate-600">{t("search.noResults")}</p>
      )}

      {hasQuery && results.length > 0 && (
        <div className="space-y-8">
          {(["trend", "event", "popup", "phrase"] as const).map((type) => {
            const bucket = grouped[type];
            if (!bucket.length) return null;
            return (
              <div key={type} className="space-y-3">
                <h2 className="text-xl font-semibold text-dancheongNavy">
                  {t(`search.section.${type}`)}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {bucket.map((hit) => (
                    <Link
                      key={hit.id}
                      to={hit.link}
                      className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-hanBlue">
                        {t(`search.badge.${type}`)}
                      </div>
                      <h3 className="text-lg font-semibold text-dancheongNavy">{hit.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-3">{hit.description}</p>
                      {hit.meta && <p className="text-xs text-slate-500">{hit.meta}</p>}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
