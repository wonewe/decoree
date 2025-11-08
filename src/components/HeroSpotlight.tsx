import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TREND_REPORTS } from "../data/trends";
import { K_CULTURE_EVENTS } from "../data/events";
import { PHRASES } from "../data/phrases";
import { useI18n } from "../shared/i18n";
import { formatDate } from "../shared/date";

type SpotlightKey = "trend" | "event" | "phrase";

type Spotlight = {
  key: SpotlightKey;
  tag: string;
  title: string;
  description: string;
  meta: string;
  imageUrl: string;
  cta: string;
  to: string;
};

const FALLBACK_PHRASE_IMAGE =
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80";

export default function HeroSpotlight() {
  const { t, language } = useI18n();

  const spotlights = useMemo<Spotlight[]>(() => {
    const trend =
      TREND_REPORTS.find((item) => item.language === language && !item.isPremium) ??
      TREND_REPORTS.find((item) => item.language === language) ??
      TREND_REPORTS[0];
    const event =
      K_CULTURE_EVENTS.find((item) => item.language === language) ?? K_CULTURE_EVENTS[0];
    const phrase =
      PHRASES.find((item) => item.language === language) ?? PHRASES[0];

    return [
      {
        key: "trend" as const,
        tag: t("hero.spotlight.tag.trend"),
        title: trend.title,
        description: trend.summary,
        meta: `${trend.neighborhood} • ${formatDate(trend.publishedAt)}`,
        imageUrl: trend.imageUrl,
        cta: t("hero.spotlight.cta.trend"),
        to: `/trends/${trend.id}`
      },
      {
        key: "event" as const,
        tag: t("hero.spotlight.tag.event"),
        title: event.title,
        description: event.description,
        meta: `${formatDate(event.date)} • ${event.location}`,
        imageUrl: event.imageUrl,
        cta: t("hero.spotlight.cta.event"),
        to: `/events/${event.id}`
      },
      {
        key: "phrase" as const,
        tag: t("hero.spotlight.tag.phrase"),
        title: phrase.korean,
        description: phrase.translation,
        meta: `${phrase.transliteration} • ${t(`phrasebook.category.${phrase.category}`)}`,
        imageUrl: FALLBACK_PHRASE_IMAGE,
        cta: t("hero.spotlight.cta.phrase"),
        to: "/phrasebook"
      }
    ];
  }, [language, t]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % spotlights.length);
    }, 10000);
    return () => window.clearInterval(interval);
  }, [spotlights.length]);

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-[1200ms] ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {spotlights.map((spotlight) => (
            <div key={spotlight.key} className="min-w-full">
              <div className="grid md:grid-cols-[1.6fr,1fr]">
                <HeroSpotlightSlide spotlight={spotlight} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 md:px-6">
        {spotlights.map((spotlight) => (
          <button
            key={spotlight.key}
            type="button"
            onClick={() => {
              const nextIndex = spotlights.findIndex((item) => item.key === spotlight.key);
              setActiveIndex(nextIndex === -1 ? 0 : nextIndex);
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              spotlights[activeIndex]?.key === spotlight.key
                ? "bg-hanBlue text-white"
                : "bg-white text-slate-600 hover:text-hanBlue"
            }`}
          >
            {spotlight.tag}
          </button>
        ))}
      </div>
    </section>
  );
}

type HeroSpotlightSlideProps = {
  spotlight: Spotlight;
};

function HeroSpotlightSlide({ spotlight }: HeroSpotlightSlideProps) {
  const { t } = useI18n();

  return (
    <>
      <div className="relative h-[240px] w-full overflow-hidden md:h-[340px]">
        <img
          key={spotlight.imageUrl}
          src={spotlight.imageUrl}
          alt={spotlight.title}
          className="h-full w-full object-cover transition-opacity duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
          <span className="badge-premium bg-white/20 text-white backdrop-blur">
            {spotlight.tag}
          </span>
          <h3 className="mt-4 text-2xl font-semibold md:text-3xl">{spotlight.title}</h3>
          <p className="mt-3 text-sm text-slate-100 md:text-base">{spotlight.description}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-6 p-6 md:h-[340px] md:p-8">
        <div className="space-y-4">
          <h4 className="text-sm uppercase tracking-wide text-slate-500">
            {t("hero.spotlight.title")}
          </h4>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-dancheongNavy md:text-2xl">
              {spotlight.title}
            </h3>
            <p className="text-sm text-slate-600 md:text-base">{spotlight.description}</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">{spotlight.meta}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Link
            to={spotlight.to}
            className="inline-flex items-center justify-center rounded-full bg-hanBlue px-5 py-3 text-sm font-semibold text-white transition hover:bg-dancheongNavy"
          >
            {spotlight.cta} →
          </Link>
          <span className="text-xs text-slate-400">{t("hero.spotlight.disclaimer")}</span>
        </div>
      </div>
    </>
  );
}
