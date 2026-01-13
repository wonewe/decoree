import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../shared/i18n";
import { formatDate } from "../shared/date";
import { getNewsletterById } from "../services/repositories/newsletterRepository";
import type { Newsletter } from "../services/repositories/newsletterRepository";
import { MarkdownContent } from "../components/MarkdownContent";

export default function NewsletterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadNewsletter();
    }
  }, [id]);

  const loadNewsletter = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getNewsletterById(id);
      if (!data) {
        setError(t("newsletter.detail.notFound"));
        return;
      }
      setNewsletter(data);
    } catch (err) {
      console.error("Failed to load newsletter:", err);
      setError(t("newsletter.detail.error"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-container">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-10 text-center shadow">
          <p className="text-sm text-[var(--ink-muted)]">{t("auth.loading")}</p>
        </div>
      </section>
    );
  }

  if (error || !newsletter) {
    return (
      <section className="section-container">
        <div className="space-y-4 rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-800 shadow">
          <h2 className="text-2xl font-semibold">{t("newsletter.detail.notFound")}</h2>
          <p className="text-sm">{error || t("newsletter.detail.error")}</p>
          <Link
            to="/newsletter"
            className="mx-auto inline-flex items-center rounded-full border border-rose-600 px-5 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-600 hover:text-white"
          >
            {t("newsletter.detail.backToList")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{newsletter.title} | {t("newsletter.title")} | koraid</title>
        <meta name="description" content={newsletter.title} />
      </Helmet>

      <article className="section-container space-y-8 py-16">
        {/* Header */}
        <header className="space-y-4">
          <Link
            to="/newsletter"
            className="inline-flex items-center text-sm font-semibold text-[var(--ink-subtle)] transition hover:text-[var(--ink)]"
          >
            ← {t("newsletter.detail.backToList")}
          </Link>
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
              {formatDate(newsletter.publishedAt)}
            </div>
            <h1 className="text-4xl font-bold text-[var(--ink)] md:text-5xl">
              {newsletter.title}
            </h1>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-8 shadow-sm">
          <MarkdownContent content={newsletter.content} />
        </div>
      </article>
    </>
  );
}

