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
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-dancheongNavy">{t("trends.title")}</h2>
        <p className="max-w-2xl text-slate-600">{t("trends.subtitle")}</p>
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
          <div className="grid gap-4 md:grid-cols-2">
            {reports.slice(0, 4).map((report) => (
              <article
                key={report.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {formatDate(report.publishedAt)} · {report.neighborhood}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-dancheongNavy">{report.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3">{report.summary}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>{report.tags.slice(0, 3).join(" / ")}</span>
                  <Link
                    to={`/trends/${report.id}`}
                    className="text-sm font-semibold text-hanBlue hover:underline"
                  >
                    {t("trends.readMore")} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {reports.length > 4 && (
            <div className="flex justify-end">
              <Link
                to="/trends"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-hanBlue hover:text-hanBlue"
              >
                {t("trends.viewAll")}
                <span>→</span>
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
