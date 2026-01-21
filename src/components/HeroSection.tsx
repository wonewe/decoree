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
    // {
    //   title: t("hero.highlights.events.title"),
    //   description: t("hero.highlights.events.description"),
    //   to: "/events",
    //   image: "/main2.jpg"
    // }, // 임시 숨김
    // {
    //   title: t("hero.highlights.phrasebook.title"),
    //   description: t("hero.highlights.phrasebook.description"),
    //   to: "/phrasebook",
    //   image: "/main3.jpg"
    // }, // 임시 숨김
    {
      title: t("hero.highlights.popups.title"),
      description: t("hero.highlights.popups.description"),
      to: "/popups",
      image: "/main4.jpg"
    }
  ] as const;

  return (
    <section className="border-b border-[var(--border)] bg-[var(--paper)]">
      <div className="section-container space-y-8 pb-12 pt-16 md:space-y-12 md:pb-16 md:pt-20">
        <div className="content-shell space-y-6 text-left">
          {t("hero.ribbon") && (
            <span className="badge-label">{t("hero.ribbon")}</span>
          )}
          <div className="space-y-4">
            <h1 className="font-heading text-4xl leading-tight text-[var(--ink)] md:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-2xl text-base text-[var(--ink-muted)] md:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/trends"
              className="primary-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
            >
              {t("hero.cta.primary")}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="card group flex flex-col gap-5 md:flex-row focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-semibold text-[var(--ink)] md:text-2xl">{item.title}</h3>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{item.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--ink)]">
                  {t("hero.highlights.cta")}
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-active:translate-x-1" aria-hidden="true">→</span>
                </span>
              </div>
              <div className="h-48 w-full overflow-hidden rounded-xl bg-[var(--paper-muted)] md:h-auto md:w-40">
                <img
                  src={item.image}
                  alt={item.title}
                  width={160}
                  height={192}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
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
