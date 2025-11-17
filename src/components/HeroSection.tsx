import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";

export default function HeroSection() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [highlightsVisible, setHighlightsVisible] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const highlightsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = highlightsRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            setHighlightsVisible(true);
          } else if (!entry.isIntersecting) {
            setHighlightsVisible(false);
          }
        });
      },
      {
        root: null,
        threshold: [0, 0.35, 1],
        rootMargin: "100px 0px -30% 0px"
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsVideoPaused(false);
    const handlePause = () => setIsVideoPaused(true);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const toggleVideoPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };
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
    <section className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/hero-seoul-timelapse.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-white"></div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="hero-gradient hero-gradient-1"></div>
        <div className="hero-gradient hero-gradient-2"></div>
      </div>
      <button
        type="button"
        onClick={toggleVideoPlayback}
        aria-pressed={isVideoPaused}
        className="absolute right-6 top-6 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
      >
        <span className="sr-only">{isVideoPaused ? "영상 재생" : "영상 일시정지"}</span>
        {isVideoPaused ? (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        )}
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-64 bg-gradient-to-b from-transparent via-white/75 to-[#F5F7FB] blur-[2px]"></div>
      <div className="section-container relative z-20 space-y-24 pt-28 pb-12 text-white md:space-y-32 md:pt-40 md:pb-60">
        <div className="flex flex-col items-center text-center">
          <div className="hero-intro flex max-w-3xl flex-col items-center space-y-6">
            {t("hero.ribbon") && (
              <span className="badge-label bg-white/25 text-white">{t("hero.ribbon")}</span>
            )}
            <h1 className="hero-fade text-4xl font-bold opacity-0 translate-y-8 text-white sm:text-5xl md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="hero-fade hero-delay-1 max-w-2xl text-lg text-white/80 opacity-0 translate-y-8">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/trends"
                className="hero-fade hero-delay-2 primary-button opacity-0 translate-y-8"
              >
                {t("hero.cta.primary")}
              </Link>
              <Link
                to="/events"
                className="hero-fade hero-delay-3 opacity-0 translate-y-8 rounded-full border border-white/10 bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              >
                {t("hero.cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
        <section
          ref={highlightsRef}
          className={`mt-24 space-y-4 rounded-3xl border border-white/40 bg-white/30 p-5 text-slate-900 shadow-lg backdrop-blur transition duration-700 ease-out transform ${
            highlightsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
          }`}
        >
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
