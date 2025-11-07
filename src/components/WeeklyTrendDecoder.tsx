import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTrendReports } from "../services/contentService";
import { useAsyncData } from "../hooks/useAsyncData";
import type { TrendIntensity, TrendReport } from "../data/trends";
import { useI18n } from "../shared/i18n";
import { getAuthorProfile } from "../data/authors";

type IntensityBadgeProps = {
  intensity: TrendIntensity;
};

function IntensityBadge({ intensity }: IntensityBadgeProps) {
  const { t } = useI18n();
  const styles: Record<TrendIntensity, string> = {
    highlight: "bg-dancheongGreen/10 text-dancheongGreen",
    insider: "bg-hanBlue/10 text-hanBlue",
    emerging: "bg-dancheongYellow/10 text-dancheongYellow"
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[intensity]}`}>
      {t(`trendDetail.intensity.${intensity}`)}
    </span>
  );
}

function TrendCard({ report }: { report: TrendReport }) {
  const { t } = useI18n();
  const [showSample, setShowSample] = useState(false);
  const author = getAuthorProfile(report.authorId);

  return (
    <article className="card">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <IntensityBadge intensity={report.intensity} />
              <span className="text-xs text-slate-400">
                {new Date(report.publishedAt).toLocaleDateString()}
              </span>
            </div>
            {report.isPremium && <span className="badge-premium">{t("trends.premiumBadge")}</span>}
          </div>
          <h3 className="text-xl font-semibold text-dancheongNavy">{report.title}</h3>
          <p className="text-slate-600">{report.summary}</p>
          {author && (
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="h-8 w-8 rounded-full object-cover"
                loading="lazy"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-600">
                  {t("trends.byline", { author: author.name })}
                </span>
                <span>{author.title}</span>
              </div>
            </div>
          )}
          <div className="text-sm text-slate-500">
            <strong>{t("trendDetail.neighborhood")}:</strong> {report.neighborhood} •{" "}
            {report.tags.join(" · ")}
          </div>
          {report.isPremium ? (
            <div className="rounded-2xl border border-dashed border-dancheongRed/40 p-4">
              {showSample ? (
                <p className="text-sm text-slate-600">{report.details}</p>
              ) : (
                <>
                  <p className="text-sm text-slate-600">{t("trends.unlock")}</p>
                  <button
                    className="mt-3 text-sm font-semibold text-hanBlue hover:underline"
                    onClick={() => setShowSample(true)}
                  >
                    {t("trends.sample")}
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-700">{report.details}</p>
          )}
          <div className="pt-2">
            <Link
              to={`/trends/${report.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-hanBlue hover:underline"
            >
              {t("trends.readMore")} →
            </Link>
          </div>
        </div>
        <figure className="overflow-hidden rounded-2xl bg-slate-100 md:w-56 lg:w-64">
          <img
            src={report.imageUrl}
            alt={report.title}
            className="h-48 w-full object-cover md:h-full"
            loading="lazy"
          />
        </figure>
      </div>
    </article>
  );
}

export default function WeeklyTrendDecoder() {
  const { t, language } = useI18n();
  const fetcher = useCallback(() => fetchTrendReports(language), [language]);
  const { status, data } = useAsyncData(fetcher);

  const sortedReports = useMemo(() => {
    if (!data) return [];
    return [...data].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [data]);

  return (
    <section className="section-container space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-dancheongNavy">{t("trends.title")}</h2>
        <p className="max-w-2xl text-slate-600">{t("trends.subtitle")}</p>
      </div>
      {status === "loading" && (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl bg-white p-6 shadow">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-5/6 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}
      {status === "success" && (
        <div className="grid gap-6 md:grid-cols-2">
          {sortedReports.map((report) => (
            <TrendCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </section>
  );
}
