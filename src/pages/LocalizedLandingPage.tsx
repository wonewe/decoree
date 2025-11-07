import { Navigate, useParams } from "react-router-dom";
import HomePage from "./HomePage";
import JapaneseLandingPage from "./JapaneseLandingPage";
import type { SupportedLanguage } from "../shared/i18n";
import { useI18n } from "../shared/i18n";
import { useEffect } from "react";

const SUPPORTED_LOCALE_ROUTES: SupportedLanguage[] = ["fr", "ko", "ja", "en"];

export default function LocalizedLandingPage() {
  const { lang } = useParams<{ lang: SupportedLanguage }>();
  const { setLanguage } = useI18n();

  useEffect(() => {
    if (lang && SUPPORTED_LOCALE_ROUTES.includes(lang)) {
      setLanguage(lang);
    }
  }, [lang, setLanguage]);

  if (!lang || !SUPPORTED_LOCALE_ROUTES.includes(lang)) {
    return <Navigate to="/" replace />;
  }

  if (lang === "ja") {
    return <JapaneseLandingPage />;
  }

  return <HomePage />;
}
