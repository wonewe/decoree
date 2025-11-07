import { useState } from "react";
import { Link } from "react-router-dom";
import type { TrendIntensity, TrendReport } from "../../data/trends";
import { useI18n } from "../../shared/i18n";
import { getAuthorProfile } from "../../data/authors";

type TrendCardProps = {
  report: TrendReport;
};

export function TrendCard({ report }: TrendCardProps) {
  const { t } = useI18n();
  const author = getAuthorProfile(report.authorId);
  const [showSample, setShowSample] = useState(false);

  const publishedLabel = new Date(report.publishedAt).toLocaleDateString();

  return (
    <article className="card">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        <div className="flex-1 space-y-4">
          <CardHeader
            intensity={report.intensity}
            publishedLabel={publishedLabel}
            isPremium={report.isPremium}
          />
          <h3 className="text-xl font-semibold text-dancheongNavy">{report.title}</h3>
          <p className="text-slate-600">{report.summary}</p>
          {author && (
            <AuthorMeta name={author.name} title={author.title} avatarUrl={author.avatarUrl} />
          )}
          <div className="text-sm text-slate-500">
            <strong>{t("trendDetail.neighborhood")}:</strong> {report.neighborhood} •{" "}
            {report.tags.join(" · ")}
          </div>
          {report.isPremium ? (
            <PremiumPreview
              showSample={showSample}
              onUnlockSample={() => setShowSample(true)}
              details={report.details}
            />
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

type CardHeaderProps = {
  intensity: TrendIntensity;
  publishedLabel: string;
  isPremium: boolean;
};

function CardHeader({ intensity, publishedLabel, isPremium }: CardHeaderProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <IntensityBadge intensity={intensity} />
        <span className="text-xs text-slate-400">{publishedLabel}</span>
      </div>
      {isPremium && <span className="badge-premium">{t("trends.premiumBadge")}</span>}
    </div>
  );
}

type AuthorMetaProps = {
  name: string;
  title: string;
  avatarUrl: string;
};

function AuthorMeta({ name, title, avatarUrl }: AuthorMetaProps) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3 text-xs text-slate-500">
      <img
        src={avatarUrl}
        alt={name}
        className="h-8 w-8 rounded-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-slate-600">
          {t("trends.byline", { author: name })}
        </span>
        <span>{title}</span>
      </div>
    </div>
  );
}

type PremiumPreviewProps = {
  showSample: boolean;
  onUnlockSample: () => void;
  details: string;
};

function PremiumPreview({ showSample, onUnlockSample, details }: PremiumPreviewProps) {
  const { t } = useI18n();

  if (showSample) {
    return (
      <div className="rounded-2xl border border-dashed border-dancheongRed/40 p-4">
        <p className="text-sm text-slate-600">{details}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-dancheongRed/40 p-4">
      <p className="text-sm text-slate-600">{t("trends.unlock")}</p>
      <button
        className="mt-3 text-sm font-semibold text-hanBlue hover:underline"
        onClick={onUnlockSample}
        type="button"
      >
        {t("trends.sample")}
      </button>
    </div>
  );
}

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
