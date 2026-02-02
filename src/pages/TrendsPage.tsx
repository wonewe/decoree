import { Helmet } from "react-helmet-async";
import { useI18n } from "../shared/i18n";
import WeeklyTrendDecoder from "../components/WeeklyTrendDecoder";

export default function TrendsPage() {
  const { t } = useI18n();
  
  const siteOrigin =
    import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "https://koraid.com");
  
  const title = `${t("trends.title")} | koraid`;
  const description = t("trends.subtitle");
  const ogImage = `${siteOrigin}/main1.jpg`;
  const canonicalUrl = `${siteOrigin}/trends`;

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
      <WeeklyTrendDecoder />
    </>
  );
}
