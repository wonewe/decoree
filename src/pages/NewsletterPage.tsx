import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../shared/i18n";
import { formatDate } from "../shared/date";
import { fetchNewsletters, type Newsletter } from "../services/repositories/newsletterRepository";

// 스티비 폼 타입 선언
declare global {
  interface Window {
    stb_subscribe_form?: {
      init: () => void;
    };
  }
}

export default function NewsletterPage() {
  const { t } = useI18n();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNewsletters();
  }, []);

  // 스티비 CSS 및 스크립트 로드
  useEffect(() => {
    // CSS가 이미 로드되어 있는지 확인
    const existingCSS = document.querySelector(
      'link[href="https://resource.stibee.com/subscribe/stb_subscribe_form_style.css"]'
    );
    
    if (!existingCSS) {
      // CSS 로드
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://resource.stibee.com/subscribe/stb_subscribe_form_style.css";
      document.head.appendChild(link);
    }

    // 이미 스크립트가 로드되어 있는지 확인
    const existingScript = document.querySelector(
      'script[src="https://resource.stibee.com/subscribe/stb_subscribe_form.js"]'
    );
    
    if (existingScript) {
      return;
    }

    // 폼이 DOM에 렌더링될 때까지 약간의 지연
    const timer = setTimeout(() => {
      // 스크립트 로드
      const script = document.createElement("script");
      script.src = "https://resource.stibee.com/subscribe/stb_subscribe_form.js";
      script.type = "text/javascript";
      script.async = true;
      
      script.onerror = () => {
        console.error("Failed to load Stibee subscription form script");
      };
      
      // body 끝에 추가 (스티비 권장 방식)
      document.body.appendChild(script);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

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

  return (
    <>
      <Helmet>
        <title>{t("newsletter.title")} | koraid</title>
        <meta name="description" content={t("newsletter.subtitle")} />
        <link
          rel="stylesheet"
          href="https://resource.stibee.com/subscribe/stb_subscribe_form_style.css"
        />
      </Helmet>

      <section className="section-container space-y-12 py-16">
        {/* Header */}
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-[var(--ink)] md:text-5xl">
            {t("newsletter.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--ink-muted)]">
            {t("newsletter.subtitle")}
          </p>
        </header>

        {/* Subscribe Form - Stibee */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--paper)] to-[var(--paper-muted)] p-8 shadow-sm">
            <div id="stb_subscribe">
              <form
                action="https://stibee.com/api/v1.0/lists/oVUdazUb9JZUikJAyW5MUOZrRTvHPQ==/public/subscribers"
                method="POST"
                target="_blank"
                acceptCharset="utf-8"
                className="stb_form"
                name="stb_subscribe_form"
                id="stb_subscribe_form"
                data-lang="en"
                noValidate
              >
                <h1 className="stb_form_title">{t("newsletter.subscribe.title")}</h1>

                <fieldset className="stb_form_set">
                  <label htmlFor="stb_email" className="stb_form_set_label">
                    {t("newsletter.subscribe.emailPlaceholder")}
                    <span className="stb_asterisk">*</span>
                  </label>
                  <input
                    type="email"
                    className="stb_form_set_input"
                    id="stb_email"
                    name="email"
                    required
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      lineHeight: "1.5",
                      backgroundColor: "#ffffff",
                      color: "#111827"
                    }}
                  />
                  <div className="stb_form_msg_error" id="stb_email_error"></div>
                </fieldset>

                <div className="stb_form_policy">
                  <label>
                    <input type="checkbox" id="stb_policy" value="stb_policy_true" required />
                    <span>({t("newsletter.subscribe.required")})</span>
                    {t("newsletter.subscribe.agree")}{" "}
                    <button
                      id="stb_form_modal_open"
                      data-modal="stb_form_policy_modal"
                      className="stb_form_modal_open_btn"
                      type="button"
                    >
                      {t("newsletter.subscribe.policy")}
                    </button>
                  </label>
                  <div className="stb_form_msg_error" id="stb_policy_error"></div>
                  <div
                    className="stb_form_modal stb_form_policy_text blind"
                    id="stb_form_policy_modal"
                  >
                    <div className="stb_form_modal_body">
                      <h1 className="stb_form_modal_title">{t("newsletter.subscribe.policy")}</h1>
                      <div className="stb_form_modal_text">
                        {t("newsletter.subscribe.policyText")}
                      </div>
                      <div className="stb_form_modal_btn">
                        <button
                          id="stb_form_modal_close"
                          className="stb_form_modal_close_btn"
                          data-modal="stb_form_policy_modal"
                          type="button"
                        >
                          {t("newsletter.subscribe.close")}
                        </button>
                      </div>
                    </div>
                    <div className="stb_form_modal_bg" id="stb_form_modal_bg"></div>
                  </div>
                </div>

                <div className="stb_form_result" id="stb_form_result"></div>

                <fieldset className="stb_form_set_submit">
                  <button
                    type="submit"
                    className="stb_form_submit_button"
                    id="stb_form_submit_button"
                    style={{ backgroundColor: "#FF6464", color: "#ffffff" }}
                  >
                    {t("newsletter.subscribe.button")}
                  </button>
                </fieldset>
              </form>
            </div>
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
              {newsletters.map((newsletter) => (
                <Link
                  key={newsletter.id}
                  to={`/newsletter/${newsletter.id}`}
                  className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                    {formatDate(newsletter.publishedAt)}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-[var(--ink)] transition group-hover:text-[var(--accent)]">
                    {newsletter.title}
                  </h3>
                  <div
                    className="mb-4 flex-grow text-sm text-[var(--ink-muted)] line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html:
                        newsletter.content
                          .replace(/<[^>]*>/g, "") // Remove HTML tags for preview
                          .substring(0, 150) + "..."
                    }}
                  />
                  <div className="text-sm font-semibold text-[var(--accent)]">
                    {t("newsletter.archives.readMore")} →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
