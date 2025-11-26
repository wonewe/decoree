import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";

export default function JapaneseLandingPage() {
  const { t } = useI18n();

  const overviewCards = [
    {
      title: t("japaneseLanding.overview.items.trend.title"),
      description: t("japaneseLanding.overview.items.trend.description"),
      to: "/trends"
    },
    {
      title: t("japaneseLanding.overview.items.event.title"),
      description: t("japaneseLanding.overview.items.event.description"),
      to: "/events"
    },
    {
      title: t("japaneseLanding.overview.items.phrase.title"),
      description: t("japaneseLanding.overview.items.phrase.description"),
      to: "/phrasebook"
    }
  ];

  const resources = [
    {
      label: t("japaneseLanding.resources.items.cultureTest"),
      to: "/culture-test"
    },
    {
      label: t("japaneseLanding.resources.items.phrasebook"),
      to: "/phrasebook"
    },
    {
      label: t("japaneseLanding.resources.items.events"),
      to: "/events"
    }
  ];

  return (
    <div className="space-y-12">
      <section className="section-container">
        <div className="rounded-3xl bg-gradient-to-br from-[var(--ink)]/10 via-[var(--paper)] to-[var(--accent)]/15 p-10 shadow-lg lg:p-16">
          <span className="badge-label">{t("japaneseLanding.badge")}</span>
          <h1 className="mt-6 text-4xl font-bold text-[var(--ink)] lg:text-5xl">
            {t("japaneseLanding.hero.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--ink-muted)]">
            {t("japaneseLanding.hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/trends" className="primary-button">
              {t("japaneseLanding.hero.primary")}
            </Link>
            <Link to="/" className="secondary-button">
              {t("japaneseLanding.hero.secondary")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-container space-y-8">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--ink)]">
            {t("japaneseLanding.overview.title")}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {overviewCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow transition hover:-translate-y-1 hover:border-[var(--ink)]/40 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-[var(--ink)] group-hover:text-[var(--ink)]">
                {card.title}
              </h3>
              <p className="text-sm text-[var(--ink-muted)]">{card.description}</p>
              <span className="text-xs font-semibold text-[var(--ink)] group-hover:underline">
                {t("hero.highlights.cta")} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-container">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--ink)]">
                {t("japaneseLanding.cta.title")}
              </h2>
              <p className="mt-2 max-w-xl text-[var(--ink-muted)]">
                {t("japaneseLanding.cta.subtitle")}
              </p>
            </div>
            <Link to="/trends" className="primary-button">
              {t("japaneseLanding.cta.button")}
            </Link>
          </div>
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-[var(--ink)]">
              {t("japaneseLanding.resources.title")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {resources.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink-muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
