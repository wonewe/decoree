import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";

export default function HeroSection() {
  const { t } = useI18n();

  const highlights = [
    {
      title: t("hero.highlights.trends.title"),
      description: t("hero.highlights.trends.description"),
      to: "/trends",
      image: "/main1.jpg"
    },
    {
      title: t("hero.highlights.events.title"),
      description: t("hero.highlights.events.description"),
      to: "/events",
      image: "/main2.jpg"
    },
    {
      title: t("hero.highlights.phrasebook.title"),
      description: t("hero.highlights.phrasebook.description"),
      to: "/phrasebook",
      image: "/main3.jpg"
    },
    {
      title: t("hero.highlights.popups.title"),
      description: t("hero.highlights.popups.description"),
      to: "/popups",
      image: "/main4.jpg"
    }
  ] as const;

  return (
    <section className="border-b border-[var(--border)] bg-[var(--paper)]">
      <div className="section-container space-y-12 pb-16 pt-20">
        <div className="content-shell space-y-8 text-left">
          {t("hero.ribbon") && (
            <span className="badge-label">{t("hero.ribbon")}</span>
          )}
          <div className="space-y-5">
            <h1 className="font-heading text-5xl leading-tight text-[var(--ink)] md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-2xl text-lg text-[var(--ink-muted)] md:text-xl">
              {t("hero.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/trends"
              className="pill-button border border-[var(--border)] bg-[var(--paper)] text-[var(--ink)] hover:-translate-y-0.5"
            >
              {t("hero.cta.primary")}
            </Link>
            <Link to="/events" className="secondary-button">
              {t("hero.cta.secondary")}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="card group flex flex-col gap-6 md:flex-row"
            >
              <div className="flex-1 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                  {t("hero.highlights.cta")}
                </p>
                <h3 className="text-2xl font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="text-sm text-[var(--ink-muted)]">{item.description}</p>
                <span className="text-sm font-semibold text-[var(--ink)]">
                  {t("hero.highlights.cta")} →
                </span>
              </div>
              <div className="h-40 w-full overflow-hidden rounded-2xl bg-[var(--paper-muted)] md:h-auto md:w-44">
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
