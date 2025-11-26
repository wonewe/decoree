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
    <section className="section-container space-y-10">
      <div className="content-shell space-y-4">
        <span className="badge-label text-[var(--ink-subtle)]">{t("hero.highlights.cta")}</span>
        <h2 className="font-heading text-4xl text-[var(--ink)]">{t("trends.title")}</h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">{t("trends.subtitle")}</p>
      </div>
      {status === "loading" && (
        <div className="grid gap-6 md:grid-cols-2">
          {skeletonItems.map((_, index) => (
            <TrendCardSkeleton key={index} />
          ))}
        </div>
      )}
      {showGrid && (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {reports.slice(0, 4).map((report) => (
              <article key={report.id} className="card gap-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                  {formatDate(report.publishedAt)} · {report.neighborhood}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[var(--ink)]">{report.title}</h3>
                  <p className="text-base text-[var(--ink-muted)] line-clamp-3">{report.summary}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--ink-subtle)]">
                  <span>{report.tags.slice(0, 3).join(" / ")}</span>
                  <Link to={`/trends/${report.id}`} className="text-sm font-semibold text-[var(--ink)]">
                    {t("trends.readMore")} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {reports.length > 4 && (
            <div className="content-shell flex justify-end">
              <Link to="/trends" className="secondary-button">
                {t("trends.viewAll")} →
              </Link>
            </div>
          )}
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
