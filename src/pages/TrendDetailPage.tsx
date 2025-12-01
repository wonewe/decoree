import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { TrendReport } from "../data/trends";
import { getTrendReportById } from "../services/contentService";
import { useI18n } from "../shared/i18n";
import { getAuthorProfile } from "../data/authors";
import { formatDate } from "../shared/date";
import { BookmarkButton } from "../components/bookmarks/BookmarkButton";
import { useAuth } from "../shared/auth";
import { MarkdownContent } from "../components/MarkdownContent";

type Status = "idle" | "loading" | "success" | "not-found" | "error";

export default function TrendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
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
    <article className="bg-[var(--paper-muted)]">
      <Helmet>
        <title>{report.title} | koraid</title>
        <meta name="description" content={report.summary} />
        <meta property="og:title" content={report.title} />
        <meta property="og:description" content={report.summary} />
        <meta property="og:image" content={report.imageUrl} />
        <meta property="og:type" content="article" />
      </Helmet>
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
        <div className="mx-auto flex max-w-3xl flex-col gap-10 py-12">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
            <span className="rounded-full bg-[var(--paper)] px-3 py-1">{tagList}</span>
            <span>·</span>
            <span>{published}</span>
            <span>·</span>
            <span>{report.neighborhood}</span>
          </div>

          <div className="space-y-4">
            {isAdmin && (
              <div className="flex justify-end">
                <Link
                  to={`/admin/edit/trends/${report.id}`}
                  className="text-xs font-semibold text-[var(--ink-subtle)] underline underline-offset-4 hover:text-[var(--ink)]"
                >
                  Studio에서 이 리포트 수정 →
                </Link>
              </div>
            )}
            <MarkdownContent content={report.content.join("\n\n")} />
          </div>

          {author && (
            <div className="border-t border-[var(--border)] pt-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
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
                  <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{author.bio}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 text-sm text-[var(--ink-subtle)]">
            <div>
              <div className="font-semibold">{t("trendDetail.sidebarTitle")}</div>
              <div className="mt-1 space-y-1">
                <div>
                  <span className="font-semibold">{t("trendDetail.neighborhood")}: </span>
                  <span>{report.neighborhood}</span>
                </div>
                <div>
                  <span className="font-semibold">{t("trendDetail.intensity")}: </span>
                  <span>{t(`trendDetail.intensity.${report.intensity}`)}</span>
                </div>
                <div>
                  <span className="font-semibold">{t("trendDetail.published")}: </span>
                  <span>{published}</span>
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <Link to="/trends" className="secondary-button">
                {t("trendDetail.backToList")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
