import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../shared/i18n";
import HeroSection from "../components/HeroSection";
import WeeklyTrendDecoder from "../components/WeeklyTrendDecoder";
// import EventCalendar from "../components/EventCalendar"; // 임시 숨김
// import PersonalizedPhrasebook from "../components/PersonalizedPhrasebook"; // 임시 숨김
import PopupRadarPreview from "../components/PopupRadarPreview";

export default function HomePage() {
  const { t } = useI18n();
  
  const siteOrigin =
    import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "https://koraid.com");
  
  const title = `${t("hero.title")} | koraid`;
  const description = t("hero.subtitle");
  const ogImage = `${siteOrigin}/main1.jpg`;
  const canonicalUrl = `${siteOrigin}/`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta property="og:site_name" content="koraid" />
        <meta property="og:locale" content="en_US" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={title} />
      </Helmet>
      <HeroSection />
      <WeeklyTrendDecoder />
      {/* <EventCalendar preview /> 임시 숨김 */}
      <PopupRadarPreview />
      {/* <PersonalizedPhrasebook /> 임시 숨김 */}
      
      {/* Additional Content Section */}
      <section className="section-container py-12 md:py-16">
        <div className="content-shell space-y-6">
          <h2 className="font-heading text-3xl text-[var(--ink)] md:text-4xl">
            {t("home.about.title")}
          </h2>
          <div className="max-w-3xl space-y-4 text-base text-[var(--ink-muted)] md:text-lg">
            <p>
              {t("home.about.paragraph1")}
            </p>
            <p>
              {t("home.about.paragraph2")}{" "}
              {t("home.about.paragraph2.link")}{" "}
              <a href="https://www.visitkorea.or.kr" target="_blank" rel="noreferrer noopener" className="text-[var(--ink)] underline underline-offset-2 hover:text-[var(--ink-muted)] transition-colors duration-150">
                {t("home.about.paragraph2.link1")}
              </a>
              {" "}{t("home.about.paragraph2.linkMiddle")}{" "}
              <a href="https://www.seoul.go.kr" target="_blank" rel="noreferrer noopener" className="text-[var(--ink)] underline underline-offset-2 hover:text-[var(--ink-muted)] transition-colors duration-150">
                {t("home.about.paragraph2.link2")}
              </a>
              {" "}{t("home.about.paragraph2.linkSuffix")}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/trends" 
                className="text-sm font-medium text-[var(--ink)] hover:text-[var(--ink-muted)] transition-colors duration-150 underline underline-offset-4"
              >
                {t("nav.trends")} →
              </Link>
              <Link 
                to="/popups" 
                className="text-sm font-medium text-[var(--ink)] hover:text-[var(--ink-muted)] transition-colors duration-150 underline underline-offset-4"
              >
                {t("nav.popups")} →
              </Link>
              <Link 
                to="/tutoring" 
                className="text-sm font-medium text-[var(--ink)] hover:text-[var(--ink-muted)] transition-colors duration-150 underline underline-offset-4"
              >
                {t("nav.tutoring")} →
              </Link>
              <Link 
                to="/newsletter" 
                className="text-sm font-medium text-[var(--ink)] hover:text-[var(--ink-muted)] transition-colors duration-150 underline underline-offset-4"
              >
                {t("nav.newsletter")} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
