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
      "nav.admin": "Studio Décorée",
      "auth.login": "Connexion",
      "auth.logout": "Déconnexion",
      "auth.signup": "Créer un compte",
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
      "footer.madeIn": "Conçu à Séoul pour les voyageurs français",
      "admin.title": "Studio Décorée",
      "admin.subtitle":
        "Ajoutez de nouveaux lieux, événements et expressions sans écrire une ligne de code. Les entrées sont enregistrées dans votre navigateur et visibles immédiatement sur le site.",
      "admin.stats.trends": "Tendances ajoutées: {count}",
      "admin.stats.events": "Événements ajoutés: {count}",
      "admin.stats.phrases": "Phrases ajoutées: {count}",
      "admin.session": "Connecté·e en tant que {email}",
      "admin.actions.reset": "Réinitialiser les ajouts locaux",
      "admin.feedback.trendSaved": "Nouvelle tendance enregistrée.",
      "admin.feedback.eventSaved": "Nouvel événement enregistré.",
      "admin.feedback.phraseSaved": "Nouvelle expression enregistrée.",
      "admin.feedback.error": "Une erreur est survenue. Réessayez.",
      "admin.feedback.cleared": "Les contenus ajoutés depuis ce navigateur ont été supprimés.",
      "admin.trend.title": "Ajouter une tendance",
      "admin.trend.description":
        "Complétez les champs puis cliquez sur “Enregistrer”. La tendance premium restera visible uniquement pour les utilisateurs connectés.",
      "admin.trend.submit": "Enregistrer la tendance",
      "admin.event.title": "Ajouter un événement K-Culture",
      "admin.event.description":
        "Renseignez les informations clés pour que les voyageuses et voyageurs puissent réserver rapidement.",
      "admin.event.submit": "Enregistrer l'événement",
      "admin.event.category.concert": "Concert / K-Pop",
      "admin.event.category.traditional": "Tradition",
      "admin.event.category.popup": "Pop-up / Atelier",
      "admin.event.category.festival": "Festival",
      "admin.phrase.title": "Ajouter une expression",
      "admin.phrase.description":
        "Ajoutez les expressions utiles découvertes sur le terrain. Elles apparaîtront dans le Phrasebook personnalisé.",
      "admin.phrase.submit": "Enregistrer l'expression",
      "admin.form.title": "Titre",
      "admin.form.neighborhood": "Quartier / Lieu",
      "admin.form.summary": "Résumé (2 phrases max)",
      "admin.form.details": "Description détaillée",
      "admin.form.tags": "Tags séparés par une virgule",
      "admin.form.intensity.highlight": "Highlight (immanquable)",
      "admin.form.intensity.insider": "Insider (initiés)",
      "admin.form.intensity.emerging": "Emergent (tendance naissante)",
      "admin.form.isPremium": "Contenu premium",
      "admin.form.saving": "Enregistrement…",
      "admin.form.location": "Adresse / Station proche",
      "admin.form.price": "Tarif (ex: 49€ ou Entrée libre)",
      "admin.form.bookingUrl": "Lien de réservation (optionnel)",
      "admin.form.korean": "Expression en coréen",
      "admin.form.transliteration": "Prononciation (translittération)",
      "admin.form.french": "Traduction française",
      "admin.form.culturalNote": "Note culturelle (optionnelle)",
      "auth.badge": "Accès sécurisé",
      "auth.title": "Connexion au compte Decorée",
      "auth.subtitle":
        "Connectez-vous pour retrouver vos favoris. Le Studio reste réservé à l'équipe Décorée.",
      "auth.email": "Email professionnel",
      "auth.password": "Mot de passe",
      "auth.submit": "Se connecter",
      "auth.loggingIn": "Connexion…",
      "auth.error.unauthorisedEmail": "Cette adresse email n'est pas autorisée. Contactez l'équipe Décorée.",
      "auth.footer.hint": "Les identifiants sont gérés par Firebase Authentication. Si vous les perdez, contactez l'administrateur.",
      "auth.footer.support": "Besoin d'aide ? hello@decoree.app",
      "auth.loading": "Chargement de l'espace sécurisé…",
      "auth.firebaseError": "Impossible d'afficher l'espace administrateur (configuration Firebase manquante).",
      "auth.loginWithGoogle": "Continuer avec Google",
      "auth.googleLoading": "Connexion Google…",
      "auth.or": "ou",
      "auth.noAccount": "Pas encore de compte ?",
      "auth.goToSignup": "Créer un accès",
      "auth.haveAccount": "Déjà enregistré ?",
      "auth.goToLogin": "Se connecter",
      "auth.signupTitle": "Créer un accès Décorée",
      "auth.signupSubtitle":
        "Créez votre espace Decorée. Pour le Studio, demandez un accès administrateur.",
      "auth.passwordConfirm": "Confirmez le mot de passe",
      "auth.createAccount": "Créer l'accès",
      "auth.signingUp": "Création du compte…",
      "auth.error.invalidCredential": "Identifiant ou mot de passe incorrect.",
      "auth.error.weakPassword": "Mot de passe trop faible (6 caractères minimum).",
      "auth.error.emailExists": "Un compte existe déjà avec cette adresse.",
      "auth.error.passwordMismatch": "Les deux mots de passe ne correspondent pas.",
      "auth.adminOnlyTitle": "Accès administrateur requis",
      "auth.adminOnlyDescription":
        "Cette section est réservée aux comptes approuvés. Contactez l'équipe Décorée pour obtenir un accès Studio.",
      "auth.adminOnlyCta": "Retour à l'accueil"
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
      "nav.admin": "Decorée 스튜디오",
      "auth.login": "로그인",
      "auth.logout": "로그아웃",
      "auth.signup": "회원가입",
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
      "footer.madeIn": "프랑스 여행자를 위해 서울에서 제작",
      "admin.title": "Decorée 콘텐츠 스튜디오",
      "admin.subtitle":
        "코드를 몰라도 새 트렌드, 이벤트, 표현을 바로 등록할 수 있습니다. 이 브라우저에 저장되고 즉시 웹앱에 반영됩니다.",
      "admin.stats.trends": "추가한 트렌드: {count}건",
      "admin.stats.events": "추가한 이벤트: {count}건",
      "admin.stats.phrases": "추가한 표현: {count}건",
      "admin.session": "{email} 계정으로 로그인됨",
      "admin.actions.reset": "내 브라우저에서 추가 내용 초기화",
      "admin.feedback.trendSaved": "새 트렌드가 저장되었습니다.",
      "admin.feedback.eventSaved": "새 이벤트가 저장되었습니다.",
      "admin.feedback.phraseSaved": "새 표현이 저장되었습니다.",
      "admin.feedback.error": "에러가 발생했습니다. 다시 시도해 주세요.",
      "admin.feedback.cleared": "이 브라우저에서 추가한 콘텐츠가 모두 삭제되었습니다.",
      "admin.trend.title": "트렌드 추가",
      "admin.trend.description":
        "필드를 입력하고 ‘저장’ 버튼을 누르면 즉시 Trend Decoder에 반영됩니다.",
      "admin.trend.submit": "트렌드 저장",
      "admin.event.title": "K-컬처 이벤트 추가",
      "admin.event.description": "여행자가 바로 예약할 수 있도록 핵심 정보를 입력해 주세요.",
      "admin.event.submit": "이벤트 저장",
      "admin.event.category.concert": "콘서트 / K-Pop",
      "admin.event.category.traditional": "전통 공연",
      "admin.event.category.popup": "팝업 / 클래스",
      "admin.event.category.festival": "페스티벌",
      "admin.phrase.title": "표현 추가",
      "admin.phrase.description": "현장에서 유용했던 표현을 공유하세요. Phrasebook에 바로 추가됩니다.",
      "admin.phrase.submit": "표현 저장",
      "admin.form.title": "제목",
      "admin.form.neighborhood": "지역 / 장소",
      "admin.form.summary": "요약 (두 문장까지)",
      "admin.form.details": "상세 설명",
      "admin.form.tags": "쉼표로 구분된 태그",
      "admin.form.intensity.highlight": "하이라이트 (꼭 방문)",
      "admin.form.intensity.insider": "인사이더 (로컬 추천)",
      "admin.form.intensity.emerging": "이머징 (요즘 뜨는 곳)",
      "admin.form.isPremium": "프리미엄 콘텐츠",
      "admin.form.saving": "저장 중…",
      "admin.form.location": "위치 / 인근 역",
      "admin.form.price": "가격 (예: 49€ 또는 무료)",
      "admin.form.bookingUrl": "예약 링크 (선택)",
      "admin.form.korean": "한국어 표현",
      "admin.form.transliteration": "발음 표기",
      "admin.form.french": "프랑스어 번역",
      "admin.form.culturalNote": "문화 팁 (선택)",
      "auth.badge": "보안 전용",
      "auth.title": "Decorée 로그인",
      "auth.subtitle":
        "로그인하여 관심 콘텐츠를 저장하세요. 스튜디오는 운영진만 접근할 수 있습니다.",
      "auth.email": "이메일",
      "auth.password": "비밀번호",
      "auth.submit": "로그인",
      "auth.loggingIn": "로그인 중…",
      "auth.error.unauthorisedEmail": "허용된 관리자 이메일이 아닙니다. 팀에 문의하세요.",
      "auth.footer.hint": "이 계정은 Firebase Authentication으로 관리됩니다. 분실 시 운영팀에 요청하세요.",
      "auth.footer.support": "지원: hello@decoree.app",
      "auth.loading": "보안 영역을 불러오는 중입니다…",
      "auth.firebaseError": "Firebase 설정을 찾을 수 없어 관리자 페이지를 표시할 수 없습니다.",
      "auth.loginWithGoogle": "Google 계정으로 계속",
      "auth.googleLoading": "Google 로그인 중…",
      "auth.or": "또는",
      "auth.noAccount": "아직 계정이 없나요?",
      "auth.goToSignup": "계정 만들기",
      "auth.haveAccount": "이미 계정이 있나요?",
      "auth.goToLogin": "로그인",
      "auth.signupTitle": "Decorée 계정 만들기",
      "auth.signupSubtitle":
        "Decorée 계정을 만들고 관심 콘텐츠를 모아보세요. 스튜디오 권한은 운영진에게 문의하세요.",
      "auth.passwordConfirm": "비밀번호 확인",
      "auth.createAccount": "계정 생성",
      "auth.signingUp": "가입 처리 중…",
      "auth.error.invalidCredential": "이메일 또는 비밀번호가 올바르지 않습니다.",
      "auth.error.weakPassword": "비밀번호를 6자 이상으로 설정하세요.",
      "auth.error.emailExists": "이미 등록된 이메일입니다.",
      "auth.error.passwordMismatch": "비밀번호가 서로 다릅니다.",
      "auth.adminOnlyTitle": "관리자 권한이 필요합니다",
      "auth.adminOnlyDescription":
        "이 페이지는 지정된 관리자만 볼 수 있습니다. 권한이 필요하다면 Decorée 운영팀에 문의해 주세요.",
      "auth.adminOnlyCta": "홈으로 돌아가기"
    }
  }
};

type I18nContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>("fr");

  const value = useMemo<I18nContextValue>(() => {
    const messages = translations[language].messages;
    const t = (key: string, variables?: Record<string, string | number>) => {
      const template = messages[key] ?? key;
      if (!variables) return template;
      return template.replace(/\{(\w+)\}/g, (_, token) =>
        Object.prototype.hasOwnProperty.call(variables, token)
          ? String(variables[token])
          : ""
      );
    };
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
