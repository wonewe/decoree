import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useI18n } from "../shared/i18n";
import { BLANK_IMAGE } from "../shared/placeholders";

export default function HeroSection() {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [animationKey, setAnimationKey] = useState(() => Date.now());

  useEffect(() => {
    // Force re-mount on load and language change so fade-in runs after refresh as well.
    const timer = requestAnimationFrame(() => setAnimationKey(Date.now()));
    return () => cancelAnimationFrame(timer);
  }, [language]);
  const highlights = [
    {
      title: t("hero.highlights.trends.title"),
      description: t("hero.highlights.trends.description"),
      to: "/trends",
      image: "/main1.jpg",
      accent: "from-black/70 via-black/20 to-transparent"
    },
    {
      title: t("hero.highlights.events.title"),
      description: t("hero.highlights.events.description"),
      to: "/events",
      image: "/main2.jpg",
      accent: "from-hanBlue/70 via-hanBlue/30 to-transparent"
    },
    {
      title: t("hero.highlights.phrasebook.title"),
      description: t("hero.highlights.phrasebook.description"),
      to: "/phrasebook",
      image: "/main3.jpg",
      accent: "from-dancheongGreen/70 via-dancheongGreen/30 to-transparent"
    },
    {
      title: t("hero.highlights.popups.title"),
      description: t("hero.highlights.popups.description"),
      to: "/popups",
      image: "/main4.jpg",
      accent: "from-dancheongYellow/70 via-dancheongYellow/30 to-transparent"
    }
  ] as const;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-dancheongYellow/40 via-white to-dancheongGreen/10 py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-gradient hero-gradient-1"></div>
        <div className="hero-gradient hero-gradient-2"></div>
      </div>
      <div className="section-container relative space-y-14 md:space-y-16">
        <div
          key={`${language}-${animationKey}`}
          className="flex flex-col items-center gap-14 md:flex-col md:items-center md:justify-center"
        >
          <div className="flex-1 space-y-6 hero-intro text-center">
            {t("hero.ribbon") && <span className="badge-label">{t("hero.ribbon")}</span>}
            <h1 className="hero-fade text-4xl font-bold opacity-0 translate-y-8 sm:text-5xl md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="hero-fade hero-delay-1 mx-auto max-w-2xl text-lg text-slate-600 opacity-0 translate-y-8">
              {t("hero.subtitle")}
            </p>
            <form
              className="hero-fade hero-delay-2 mx-auto flex w-full max-w-5xl flex-col gap-4 opacity-0 translate-y-8"
              onSubmit={(event) => {
                event.preventDefault();
                const trimmed = searchTerm.trim();
                navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
              }}
            >
              <div className="relative overflow-hidden rounded-full border border-white/60 bg-white/90 shadow-xl backdrop-blur-sm ring-1 ring-slate-200/60 focus-within:ring-2 focus-within:ring-hanBlue/50">
                <input
                  id="hero-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("hero.search.placeholder")}
                  className="w-full rounded-full bg-transparent px-6 py-4 pr-28 text-base text-slate-800 outline-none placeholder:text-slate-400"
                />
                <div className="absolute inset-y-2 right-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex h-full items-center justify-center rounded-full bg-gradient-to-r from-hanBlue to-dancheongGreen px-5 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 disabled:opacity-60"
                    disabled={!searchTerm.trim()}
                  >
                    <span className="sr-only">{t("hero.search.cta")}</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="6" className="opacity-90" />
                      <line x1="15.5" y1="15.5" x2="20" y2="20" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="hero-fade hero-delay-3 text-xs text-slate-500">
                {t("hero.search.helper")}
              </p>
            </form>
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
