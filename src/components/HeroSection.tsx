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
    <section className="border-b border-slate-200 bg-white">
      <div className="section-container space-y-12 pb-12 pt-16">
        <div className="flex flex-col gap-6 text-left">
          {t("hero.ribbon") && (
            <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {t("hero.ribbon")}
            </span>
          )}
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-2xl text-base text-slate-600 md:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/trends" className="primary-button">
              {t("hero.cta.primary")}
            </Link>
            <Link
              to="/events"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-500 hover:text-slate-900"
            >
              {t("hero.cta.secondary")}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex-1 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t("hero.highlights.cta")}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-slate-700">
                  {t("hero.highlights.cta")} →
                </span>
              </div>
              <div className="hidden w-44 overflow-hidden md:block">
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
