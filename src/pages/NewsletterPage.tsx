import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../shared/i18n";
import { formatDate } from "../shared/date";
import { fetchNewsletters, type Newsletter } from "../services/repositories/newsletterRepository";
import { subscribeToNewsletter } from "../services/repositories/newsletterSubscriptionRepository";

export default function NewsletterPage() {
  const { t } = useI18n();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    loadNewsletters();
  }, []);

  useEffect(() => {
    if (!submitSuccess) return;

    const timer = setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [submitSuccess]);

  const loadNewsletters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNewsletters();
      setNewsletters(data);
    } catch (err) {
      console.error("Failed to load newsletters:", err);
      setError(t("newsletter.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!email || !agreed) {
      setSubmitError(t("newsletter.subscribe.error"));
      return;
    }

    try {
      setSubmitting(true);
      await subscribeToNewsletter(email);
      setSubmitSuccess(true);
      setEmail("");
      setAgreed(false);
    } catch (err) {
      console.error("Failed to subscribe:", err);
      setSubmitError(t("newsletter.subscribe.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("newsletter.title")} | koraid</title>
        <meta name="description" content={t("newsletter.subtitle")} />
      </Helmet>

      <section className="section-container space-y-12 py-16">
        {/* Header */}
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-serif font-bold text-[var(--ink)] md:text-5xl">
            {t("newsletter.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--ink-muted)]">
            {t("newsletter.subtitle")}
          </p>
        </header>

        {/* Subscribe Form */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">
                {t("newsletter.subscribe.title")}
              </h2>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[var(--ink)]">
                  {t("newsletter.subscribe.emailPlaceholder")}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-lg border border-gray-300 px-3 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  placeholder={t("newsletter.subscribe.emailPlaceholder")}
                />
              </div>

              {/* Consent Checkbox */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    className="mt-1 h-4 w-4 rounded-full border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-2"
                  />
                  <span className="text-sm text-[var(--ink)]">
                    ({t("newsletter.subscribe.required")}) {t("newsletter.subscribe.agree")}{" "}
                    <button
                      type="button"
                      onClick={() => setShowPolicy(!showPolicy)}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {t("newsletter.subscribe.policy")}
                    </button>
                  </span>
                </label>
              </div>

              {/* Policy Section */}
              {showPolicy && (
                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <h3 className="text-xl font-serif font-bold text-[var(--ink)]">
                    {t("newsletter.subscribe.policy")}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                    {t("newsletter.subscribe.policyText")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPolicy(false)}
                    className="text-left text-sm text-[var(--accent)] hover:underline"
                  >
                    {t("newsletter.subscribe.close")}
                  </button>
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                  {t("newsletter.subscribe.success")}
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#FF6464] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#ff5252] disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                {submitting ? t("newsletter.subscribe.submitting") : t("newsletter.subscribe.button")}
              </button>
            </form>
          </div>
        </div>

        {/* Newsletter List */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-[var(--ink)]">
            {t("newsletter.archives.title")}
          </h2>

          {loading ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-10 text-center">
              <p className="text-sm text-[var(--ink-muted)]">{t("auth.loading")}</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              {error}
            </div>
          ) : newsletters.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--paper-muted)] p-10 text-center">
              <p className="text-[var(--ink-muted)]">{t("newsletter.archives.empty")}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsletters.map((newsletter) => {
                const CardContent = (
                  <>
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                      {formatDate(newsletter.publishedAt)}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-[var(--ink)] transition group-hover:text-[var(--accent)]">
                      {newsletter.title}
                    </h3>
                    {newsletter.content && (
                      <div
                        className="mb-4 flex-grow text-sm text-[var(--ink-muted)] line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html:
                            newsletter.content
                              .replace(/<[^>]*>/g, "") // Remove HTML tags for preview
                              .substring(0, 150) + "..."
                        }}
                      />
                    )}
                    <div className="text-sm font-semibold text-[var(--accent)]">
                      {t("newsletter.archives.readMore")} →
                    </div>
                  </>
                );

                if (newsletter.externalUrl) {
                  return (
                    <a
                      key={newsletter.id}
                      href={newsletter.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm transition hover:shadow-md"
                    >
                      {CardContent}
                    </a>
                  );
                }

                return (
                  <Link
                    key={newsletter.id}
                    to={`/newsletter/${newsletter.id}`}
                    className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm transition hover:shadow-md"
                  >
                    {CardContent}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
