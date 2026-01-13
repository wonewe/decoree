import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { useAuth } from "../shared/auth";

export default function TutoringMembershipPage() {
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>{t("tutoring.membership.title")} | koraid</title>
        <meta name="description" content={t("tutoring.membership.subtitle")} />
      </Helmet>

      <section className="section-container space-y-16 py-16">
        {/* Header */}
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-[var(--ink)] md:text-5xl">
            {t("tutoring.membership.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--ink-muted)]">
            {t("tutoring.membership.subtitle")}
          </p>
        </header>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Basic Membership */}
          <div className="flex flex-col rounded-3xl border-2 border-[var(--border)] bg-[var(--paper)] p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold text-[var(--ink)]">
                {t("tutoring.membership.basic.title")}
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[var(--ink)]">
                  {t("tutoring.membership.basic.price")}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                {t("tutoring.membership.basic.sessions")}
              </p>
            </div>

            <div className="mb-8 flex-grow space-y-4">
              <h3 className="text-lg font-semibold text-[var(--ink)]">
                {t("tutoring.membership.benefits.title")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-xl">📚</span>
                  <span className="text-[var(--ink-muted)]">
                    {t("tutoring.membership.benefits.materials")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-xl">💬</span>
                  <span className="text-[var(--ink-muted)]">
                    {t("tutoring.membership.benefits.tutoring")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-xl">✓</span>
                  <span className="text-[var(--ink-muted)]">
                    {t("tutoring.membership.basic.sessionsDetail")}
                  </span>
                </li>
              </ul>
            </div>

            <Link
              to={user ? "#" : "/login"}
              className="primary-button w-full text-center"
              onClick={(e) => {
                if (!user) return;
                e.preventDefault();
                // TODO: Lemon Squeezy 통합 시 결제 링크로 이동
              }}
            >
              {t("tutoring.membership.basic.cta")}
            </Link>
          </div>

          {/* Pro Membership */}
          <div className="flex flex-col rounded-3xl border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent)]/5 to-[var(--paper)] p-8 shadow-lg relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-4 py-1 text-sm font-semibold text-white">
              {t("tutoring.membership.pro.badge")}
            </div>
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold text-[var(--ink)]">
                {t("tutoring.membership.pro.title")}
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[var(--ink)]">
                  {t("tutoring.membership.pro.price")}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                {t("tutoring.membership.pro.sessions")}
              </p>
            </div>

            <div className="mb-8 flex-grow space-y-4">
              <h3 className="text-lg font-semibold text-[var(--ink)]">
                {t("tutoring.membership.benefits.title")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-xl">📚</span>
                  <span className="text-[var(--ink-muted)]">
                    {t("tutoring.membership.benefits.materials")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-xl">💬</span>
                  <span className="text-[var(--ink-muted)]">
                    {t("tutoring.membership.benefits.tutoring")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-xl">✓</span>
                  <span className="text-[var(--ink-muted)]">
                    {t("tutoring.membership.pro.sessionsDetail")}
                  </span>
                </li>
              </ul>
            </div>

            <Link
              to={user ? "#" : "/login"}
              className="primary-button w-full text-center bg-[var(--accent)] hover:bg-[var(--accent)]/90"
              onClick={(e) => {
                if (!user) return;
                e.preventDefault();
                // TODO: Lemon Squeezy 통합 시 결제 링크로 이동
              }}
            >
              {t("tutoring.membership.pro.cta")}
            </Link>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center">
            <h2 className="mb-3 text-3xl font-bold text-[var(--ink)] md:text-4xl">
              {t("tutoring.membership.reviews.title")}
            </h2>
            <p className="text-[var(--ink-muted)]">
              {t("tutoring.membership.reviews.subtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <p className="mb-4 flex-grow text-sm leading-relaxed text-[var(--ink-muted)]">
                  {t(`tutoring.membership.reviews.review${num}.text`)}
                </p>
                <div className="border-t border-[var(--border)] pt-4">
                  <p className="font-semibold text-[var(--ink)]">
                    {t(`tutoring.membership.reviews.review${num}.name`)}
                  </p>
                  <p className="text-xs text-[var(--ink-subtle)]">
                    {t(`tutoring.membership.reviews.review${num}.role`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--paper-muted)] p-8">
          <h2 className="text-2xl font-bold text-[var(--ink)]">
            {t("tutoring.membership.faq.title")}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-[var(--ink)]">
                {t("tutoring.membership.faq.q1.question")}
              </h3>
              <p className="text-sm text-[var(--ink-muted)]">
                {t("tutoring.membership.faq.q1.answer")}
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-[var(--ink)]">
                {t("tutoring.membership.faq.q2.question")}
              </h3>
              <p className="text-sm text-[var(--ink-muted)]">
                {t("tutoring.membership.faq.q2.answer")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

