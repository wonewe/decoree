import { Helmet } from "react-helmet-async";
import { useI18n } from "../shared/i18n";
import PersonalizedPhrasebook from "../components/PersonalizedPhrasebook";

export default function PhrasebookPage() {
  const { t } = useI18n();
  
  const siteOrigin =
    import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "https://koraid.com");
  
  const title = `${t("phrasebook.title")} | koraid`;
  const description = t("phrasebook.subtitle");
  const ogImage = `${siteOrigin}/main3.jpg`;
  const canonicalUrl = `${siteOrigin}/phrasebook`;

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
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <PersonalizedPhrasebook />
    </>
  );
}
