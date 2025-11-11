import { type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { TrendIntensity, TrendReport } from "../../data/trends";
import { useI18n } from "../../shared/i18n";
import { getAuthorProfile } from "../../data/authors";
import { formatDate } from "../../shared/date";
import { BookmarkButton } from "../bookmarks/BookmarkButton";

type TrendCardProps = {
  report: TrendReport;
};

export function TrendCard({ report }: TrendCardProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const author = getAuthorProfile(report.authorId);
  const bookmarkItem = {
    id: report.id,
    type: "trend" as const,
    title: report.title,
    summary: report.summary,
    imageUrl: report.imageUrl,
    location: report.neighborhood,
    href: `/trends/${report.id}`
  };

  const publishedLabel = formatDate(report.publishedAt);
  const goToDetail = () => {
    navigate(`/trends/${report.id}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToDetail();
    }
  };

  return (
    <article
      className="card cursor-pointer transition-[box-shadow,transform] hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hanBlue"
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <CardHeader intensity={report.intensity} publishedLabel={publishedLabel} />
            <BookmarkButton item={bookmarkItem} size="sm" />
          </div>
          <h3 className="text-lg font-semibold text-dancheongNavy">{report.title}</h3>
          <p className="text-sm text-slate-600">{report.summary}</p>
          {author && (
            <AuthorMeta name={author.name} title={author.title} avatarUrl={author.avatarUrl} />
          )}
          <div className="text-xs text-slate-500">
            <strong>{t("trendDetail.neighborhood")}:</strong> {report.neighborhood} •{" "}
            {report.tags.join(" · ")}
          </div>
          <p className="text-sm text-slate-700">{report.details}</p>
        </div>
        <figure className="overflow-hidden rounded-2xl bg-slate-100 md:w-40 lg:w-48">
          <img
            src={report.imageUrl}
            alt={report.title}
            className="h-28 w-full object-cover md:h-full"
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
};

function CardHeader({ intensity, publishedLabel }: CardHeaderProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <IntensityBadge intensity={intensity} />
        <span className="text-xs text-slate-400">{publishedLabel}</span>
      </div>
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
