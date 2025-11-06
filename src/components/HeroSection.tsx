import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";

export default function HeroSection() {
  const { t } = useI18n();
  const highlights = [
    {
      icon: "📰",
      title: t("hero.highlights.trends.title"),
      description: t("hero.highlights.trends.description"),
      to: "/trends"
    },
    {
      icon: "🎟️",
      title: t("hero.highlights.events.title"),
      description: t("hero.highlights.events.description"),
      to: "/events"
    },
    {
      icon: "🗣️",
      title: t("hero.highlights.phrasebook.title"),
      description: t("hero.highlights.phrasebook.description"),
      to: "/phrasebook"
    }
  ] as const;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-dancheongYellow/40 via-white to-dancheongGreen/10">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-gradient hero-gradient-1"></div>
        <div className="hero-gradient hero-gradient-2"></div>
      </div>
      <div className="section-container space-y-10 relative">
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-6 hero-intro">
            <span className="badge-premium">{t("hero.ribbon")}</span>
            <h1 className="hero-fade text-4xl font-bold opacity-0 translate-y-8 sm:text-5xl md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="hero-fade hero-delay-1 max-w-xl text-lg text-slate-600 opacity-0 translate-y-8">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/trends"
                className="hero-fade hero-delay-2 primary-button opacity-0 translate-y-8"
              >
                {t("hero.cta.primary")}
              </Link>
              <Link to="/events" className="secondary-button">
                {t("hero.cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
        <section className="space-y-6 rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur md:p-8">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-500">
            {t("hero.highlights.title")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-hanBlue/40 hover:shadow-xl"
              >
                <span className="text-2xl" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-dancheongNavy group-hover:text-hanBlue">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <span className="text-xs font-semibold text-hanBlue group-hover:underline">
                  {t("hero.highlights.cta")} →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
