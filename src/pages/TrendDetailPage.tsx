import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { TrendReport } from "../data/trends";
import { getTrendReportById } from "../services/contentService";
import { useI18n } from "../shared/i18n";
import { getAuthorProfile } from "../data/authors";
import { formatDate } from "../shared/date";
import { BookmarkButton } from "../components/bookmarks/BookmarkButton";
import { MarkdownContent } from "../components/MarkdownContent";

type Status = "idle" | "loading" | "success" | "not-found" | "error";

export default function TrendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<TrendReport | null>(null);

  useEffect(() => {
    if (!id) return;
    setStatus("loading");
    getTrendReportById(id)
      .then((data) => {
        if (!data) {
          setStatus("not-found");
          return;
        }
        setReport(data);
        setStatus("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading" || status === "idle") {
    return (
      <section className="section-container">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
      </section>
    );
  }

  if (status === "not-found" || !report) {
    return (
      <section className="section-container space-y-6 text-center">
        <h2 className="text-3xl font-semibold text-dancheongNavy">
          {t("trendDetail.notFound")}
        </h2>
        <p className="text-slate-600">{t("trendDetail.notFoundSubtitle")}</p>
        <button
          onClick={() => navigate(-1)}
          className="primary-button inline-flex items-center justify-center"
        >
          {t("trendDetail.goBack")}
        </button>
      </section>
    );
  }

  const published = formatDate(report.publishedAt);
  const tagList = report.tags.join(" • ");
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

  return (
    <article className="bg-white">
      <div className="relative h-[340px] w-full overflow-hidden">
        <img
          src={report.imageUrl}
          alt={report.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute right-6 top-6">
          <BookmarkButton item={bookmarkItem} />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-8 text-white">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur hover:bg-white/40"
          >
            ← {t("trendDetail.back")}
          </button>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-100">
            <span>{published}</span>
            <span>•</span>
            <span>{report.neighborhood}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{report.title}</h1>
          <p className="mt-2 max-w-3xl text-base text-slate-100 md:text-lg">{report.summary}</p>
        </div>
      </div>

      <div className="section-container">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">{tagList}</span>
        </div>

        <MarkdownContent content={report.content.join("\n\n")} />
        {author && (
          <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow md:flex-row md:items-center md:gap-6">
            <img
              src={author.avatarUrl}
              alt={author.name}
              loading="lazy"
              className="h-20 w-20 flex-shrink-0 rounded-full object-cover shadow"
            />
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t("trendDetail.author.label")}
              </p>
              <h3 className="text-xl font-semibold text-dancheongNavy">{author.name}</h3>
              <p className="text-sm font-semibold text-slate-500">{author.title}</p>
              <p className="text-sm text-slate-600">{author.bio}</p>
            </div>
          </div>
        )}

        <aside className="mt-10 rounded-3xl bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-dancheongNavy">
            {t("trendDetail.sidebarTitle")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>
              <strong>{t("trendDetail.neighborhood")}: </strong>
              {report.neighborhood}
            </li>
            <li>
              <strong>{t("trendDetail.intensity")}: </strong>
              {t(`trendDetail.intensity.${report.intensity}`)}
            </li>
            <li>
              <strong>{t("trendDetail.published")}: </strong>
              {published}
            </li>
          </ul>
        </aside>

        <div className="mt-12 flex justify-end">
          <Link to="/trends" className="secondary-button">
            {t("trendDetail.backToList")}
          </Link>
        </div>
      </div>
    </article>
  );
}
