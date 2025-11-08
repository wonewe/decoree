import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";

export default function HeroSection() {
  const { t } = useI18n();
  const highlights = [
    {
      title: t("hero.highlights.trends.title"),
      description: t("hero.highlights.trends.description"),
      to: "/trends",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      accent: "from-black/70 via-black/20 to-transparent"
    },
    {
      title: t("hero.highlights.events.title"),
      description: t("hero.highlights.events.description"),
      to: "/events",
      image:
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
      accent: "from-hanBlue/70 via-hanBlue/30 to-transparent"
    },
    {
      title: t("hero.highlights.phrasebook.title"),
      description: t("hero.highlights.phrasebook.description"),
      to: "/phrasebook",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
      accent: "from-dancheongGreen/70 via-dancheongGreen/30 to-transparent"
    },
    {
      title: t("hero.highlights.popups.title"),
      description: t("hero.highlights.popups.description"),
      to: "/popups",
      image:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      accent: "from-dancheongYellow/70 via-dancheongYellow/30 to-transparent"
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
              <Link
                to="/events"
                className="hero-fade hero-delay-3 secondary-button opacity-0 translate-y-8"
              >
                {t("hero.cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
        <section className="space-y-4 rounded-3xl border border-white/40 bg-white/30 p-5 shadow-lg backdrop-blur">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            {t("hero.highlights.title")}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {highlights.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <div className="absolute inset-0">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-200 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.accent} backdrop-blur-sm`}
                  ></div>
                </div>
                <div className="relative flex min-h-[160px] flex-col justify-between p-4 text-white">
                  <div>
                    <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-1 text-xs text-white/75">{item.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 transition duration-200 group-hover:translate-x-0 translate-x-2">
                    {t("hero.highlights.cta")} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
