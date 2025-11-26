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
        <div className="h-72 animate-pulse rounded-3xl bg-[var(--paper-muted)]" />
      </section>
    );
  }

  if (status === "not-found" || !report) {
    return (
      <section className="section-container space-y-6 text-center">
        <h2 className="text-3xl font-semibold text-[var(--ink)]">
          {t("trendDetail.notFound")}
        </h2>
        <p className="text-[var(--ink-muted)]">{t("trendDetail.notFoundSubtitle")}</p>
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
    <article className="bg-[var(--paper)]">
      <div className="relative h-[320px] w-full overflow-hidden">
        <img
          src={report.imageUrl}
          alt={report.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute right-6 top-6">
          <BookmarkButton item={bookmarkItem} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/35 to-transparent" />
        <div className="absolute bottom-6 left-1/2 w-full max-w-5xl -translate-x-1/2 px-6">
          <div className="rounded-2xl border border-white/40 bg-white/90 p-5 text-slate-900 shadow-lg backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1 transition hover:-translate-y-0.5 hover:shadow"
              >
                ← {t("trendDetail.back")}
              </button>
              <span className="rounded-full bg-white/70 px-2 py-1">{report.neighborhood}</span>
              <span>•</span>
              <span>{published}</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-snug md:text-4xl">{report.title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-700 md:text-base">{report.summary}</p>
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 py-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-[var(--ink-subtle)]">
            <span className="rounded-full bg-[var(--paper-muted)] px-3 py-1">{tagList}</span>
          </div>

          <MarkdownContent content={report.content.join("\n\n")} />

          {author && (
            <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm md:flex-row md:items-center md:gap-6">
              <img
                src={author.avatarUrl}
                alt={author.name}
                loading="lazy"
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover shadow"
              />
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                  {t("trendDetail.author.label")}
                </p>
                <h3 className="text-lg font-semibold text-[var(--ink)]">{author.name}</h3>
                <p className="text-sm font-semibold text-[var(--ink-subtle)]">{author.title}</p>
                <p className="text-sm text-[var(--ink-muted)]">{author.bio}</p>
              </div>
            </div>
          )}

          <aside className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--ink)]">
              {t("trendDetail.sidebarTitle")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--ink-muted)]">
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

          <div className="flex justify-end">
            <Link to="/trends" className="secondary-button">
              {t("trendDetail.backToList")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
