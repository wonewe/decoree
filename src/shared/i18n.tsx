import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type SupportedLanguage = "fr" | "ko";

type TranslationDictionary = Record<
  SupportedLanguage,
  {
    label: string;
    messages: Record<string, string>;
  }
>;

const translations: TranslationDictionary = {
  fr: {
    label: "Français",
    messages: {
      "nav.home": "Accueil",
      "nav.trends": "Trend Decoder",
      "nav.events": "Calendrier",
      "nav.phrasebook": "Phrasebook",
      "nav.subscribe": "Abonnement Premium",
      "hero.title": "Découvrir la Corée sans barrières",
      "hero.subtitle":
        "Décodage des tendances, événements K-culture et phrasebook personnalisé, conçus pour les voyageurs francophones.",
      "hero.cta.primary": "Explorer les tendances",
      "hero.cta.secondary": "Voir les nouveautés",
      "trends.title": "Weekly Trend Decoder",
      "trends.subtitle": "Analyses hebdomadaires des tendances coréennes, en français.",
      "trends.premiumBadge": "Premium",
      "trends.unlock": "Débloquer via l'abonnement",
      "trends.sample": "Voir un extrait gratuit",
      "events.title": "K-Culture Event Calendar",
      "events.subtitle":
        "Filtrer les concerts, festivals et pop-ups selon vos dates et envies.",
      "events.filter.label": "Filtrer par type",
      "events.filter.all": "Tous",
      "events.empty": "Aucun événement ne correspond à vos critères pour le moment.",
      "phrasebook.title": "Personalized Korean Phrasebook",
      "phrasebook.subtitle":
        "Choisissez vos centres d'intérêt et pratiquez des expressions essentielles avec audio et mémos culturels.",
      "phrasebook.category.food": "Gastronomie",
      "phrasebook.category.shopping": "Shopping",
      "phrasebook.category.entertainment": "Sorties & K-Culture",
      "phrasebook.completed": "Expressions consultées",
      "subscription.title": "Passez en Premium",
      "subscription.subtitle":
        "Accédez au Trend Decoder complet, à des guides exclusifs et à des conseils personnalisés.",
      "subscription.price": "6,90€ / mois après l'essai gratuit de 7 jours",
      "subscription.cta": "Activer l'abonnement",
      "subscription.mockWarning":
        "Intégration Stripe simulée pour l'environnement MVP. Remplacez l'endpoint par votre fonction serveur.",
      "footer.madeIn": "Conçu à Séoul pour les voyageurs français"
    }
  },
  ko: {
    label: "한국어",
    messages: {
      "nav.home": "홈",
      "nav.trends": "트렌드 리포트",
      "nav.events": "이벤트 캘린더",
      "nav.phrasebook": "맞춤형 회화",
      "nav.subscribe": "프리미엄 구독",
      "hero.title": "언어 장벽 없이 한국 여행",
      "hero.subtitle":
        "프랑스어로 제공되는 최신 트렌드 분석, K-컬처 이벤트, 관심사별 한국어 표현 학습.",
      "hero.cta.primary": "트렌드 확인하기",
      "hero.cta.secondary": "새소식 보기",
      "trends.title": "주간 트렌드 해독 리포트",
      "trends.subtitle": "프랑스 여행자를 위한 심층 소비 트렌드 분석.",
      "trends.premiumBadge": "프리미엄",
      "trends.unlock": "구독으로 전체 보기",
      "trends.sample": "무료 미리보기",
      "events.title": "K-컬처 이벤트 캘린더",
      "events.subtitle": "여행 일정에 맞는 공연, 축제, 팝업을 검색하세요.",
      "events.filter.label": "유형 선택",
      "events.filter.all": "전체",
      "events.empty": "조건에 맞는 이벤트가 없습니다.",
      "phrasebook.title": "맞춤형 한국어 회화장",
      "phrasebook.subtitle": "관심사를 선택하고 필수 표현과 문화 팁을 익히세요.",
      "phrasebook.category.food": "맛집 & 식문화",
      "phrasebook.category.shopping": "쇼핑",
      "phrasebook.category.entertainment": "문화·엔터",
      "phrasebook.completed": "학습한 표현",
      "subscription.title": "프리미엄으로 업그레이드",
      "subscription.subtitle":
        "트렌드 전체 리포트와 독점 가이드, 맞춤 추천을 이용해 보세요.",
      "subscription.price": "7일 무료 체험 후 월 6.90€",
      "subscription.cta": "구독 시작하기",
      "subscription.mockWarning": "MVP 환경을 위한 Stripe 연동 시뮬레이션입니다.",
      "footer.madeIn": "프랑스 여행자를 위해 서울에서 제작"
    }
  }
};

type I18nContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>("fr");

  const value = useMemo<I18nContextValue>(() => {
    const messages = translations[language].messages;
    const t = (key: string) => messages[key] ?? key;
    return { language, setLanguage, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function getLanguageLabel(lang: SupportedLanguage) {
  return translations[lang].label;
}
