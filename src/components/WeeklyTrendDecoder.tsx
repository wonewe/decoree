import { useMemo } from "react";
import { useI18n } from "../shared/i18n";
import { TrendCard } from "./trends/TrendCard";
import { TrendCardSkeleton } from "./trends/TrendCardSkeleton";
import { TrendEmptyState } from "./trends/TrendEmptyState";
import { useTrendReports } from "../hooks/useTrendReports";

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
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map((report) => (
            <TrendCard key={report.id} report={report} />
          ))}
        </div>
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
