import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { TrendCardSkeleton } from "./trends/TrendCardSkeleton";
import { TrendEmptyState } from "./trends/TrendEmptyState";
import { useTrendReports } from "../hooks/useTrendReports";
import { formatDate } from "../shared/date";

export default function WeeklyTrendDecoder() {
  const { t, language } = useI18n();
  const { status, reports, error, hasReports } = useTrendReports(language);
  const skeletonItems = useMemo(() => Array.from({ length: 3 }), []);
  const showGrid = status === "success" && hasReports;
  const showEmpty = status === "success" && !hasReports;
  const showError = status === "error";

  return (
    <section className="section-container space-y-8">
      <div className="content-shell space-y-4">
        <span className="badge-label">{t("hero.highlights.cta")}</span>
        <h1 className="font-heading text-3xl text-[var(--ink)] md:text-4xl">{t("trends.title")}</h1>
        <p className="max-w-2xl text-sm text-[var(--ink-muted)] md:text-base">{t("trends.subtitle")}</p>
        <div className="max-w-2xl space-y-2 text-sm text-[var(--ink-muted)] md:text-base">
          <p>
            {t("trends.description")}{" "}
            {t("trends.description.link")}{" "}
            <a href="https://www.instagram.com/explore/tags/seoul" target="_blank" rel="noreferrer noopener" className="text-[var(--ink)] underline underline-offset-2 hover:text-[var(--ink-muted)] transition-colors duration-150">
              {t("trends.description.linkText")}
            </a>
            {" "}{t("trends.description.linkSuffix")}
          </p>
          <p>
            {t("trends.description2")}
          </p>
        </div>
      </div>
      {status === "loading" && (
        <div className="grid gap-5 md:grid-cols-2">
          {skeletonItems.map((_, index) => (
            <TrendCardSkeleton key={index} />
          ))}
        </div>
      )}
      {showGrid && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map((report) => (
              <article key={report.id} className="card space-y-3">
                <div className="text-xs font-medium uppercase tracking-wide text-[var(--ink-subtle)]">
                  {formatDate(report.publishedAt)} · {report.neighborhood}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--ink)] md:text-xl">{report.title}</h3>
                  <p className="text-sm text-[var(--ink-muted)] line-clamp-3 leading-relaxed">{report.summary}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-[var(--ink-subtle)]">{report.tags.slice(0, 3).join(" / ")}</span>
                  <Link 
                    to={`/trends/${report.id}`} 
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--ink)] transition-colors duration-150 hover:text-[var(--ink-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 rounded"
                  >
                    {t("trends.readMore")}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="flex justify-center pt-4">
            <Link 
              to="/trends" 
              className="secondary-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
            >
              {t("trends.viewAll")} →
            </Link>
          </div>
        </>
      )}
      {showEmpty && (
        <TrendEmptyState
          title={t("trends.empty")}
          description={t("trends.subtitle")}
        />
      )}
      {showError && (
        <TrendEmptyState
          title={t("trends.error")}
          description={error?.message ?? t("trends.subtitle")}
        />
      )}
    </section>
  );
}
