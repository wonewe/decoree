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
      "hero.ribbon": "Decorée MVP",
      "hero.card.title": "Weekly Trend Decoder",
      "hero.card.subtitle": "Pop-up Han River Sunset Market",
      "hero.card.caption": "Stripe, Firebase, Google Maps — prêts pour l'intégration finale.",
      "hero.spotlight.title": "Sélection Décorée",
      "hero.spotlight.tag.trend": "Trend Decoder",
      "hero.spotlight.tag.event": "Event Calendar",
      "hero.spotlight.tag.phrase": "Phrasebook",
      "hero.spotlight.cta.trend": "Lire la tendance complète",
      "hero.spotlight.cta.event": "Réserver sa place",
      "hero.spotlight.cta.phrase": "Apprendre l'expression",
      "hero.spotlight.disclaimer": "Les contenus premium sont réservés aux abonnés Decorée.",
      "trends.title": "Weekly Trend Decoder",
      "trends.subtitle": "Analyses hebdomadaires des tendances coréennes, en français.",
      "trends.premiumBadge": "Premium",
      "trends.unlock": "Débloquer via l'abonnement",
      "trends.sample": "Voir un extrait gratuit",
      "trends.readMore": "Lire le reportage",
      "events.title": "K-Culture Event Calendar",
      "events.subtitle":
        "Filtrer les concerts, festivals et pop-ups selon vos dates et envies.",
      "events.filter.label": "Filtrer par type",
      "events.filter.all": "Tous",
      "events.empty": "Aucun événement ne correspond à vos critères pour le moment.",
      "event.eventCategory.concert": "Concert / K-Pop",
      "event.eventCategory.traditional": "Tradition",
      "event.eventCategory.pop-up": "Pop-up / Atelier",
      "event.eventCategory.festival": "Festival",
      "eventDetail.readMore": "Découvrir l'événement",
      "phrasebook.title": "Personalized Korean Phrasebook",
      "phrasebook.subtitle":
        "Choisissez vos centres d'intérêt et pratiquez des expressions essentielles avec audio et mémos culturels.",
      "phrasebook.category.food": "Gastronomie",
      "phrasebook.category.shopping": "Shopping",
      "phrasebook.category.entertainment": "Sorties & K-Culture",
      "phrasebook.completed": "Expressions consultées",
      "phrasebook.search.label": "Rechercher une expression",
      "phrasebook.search.placeholder": "Rechercher: dessert, shopping, 감사합니다…",
      "phrasebook.search.clear": "Effacer",
      "phrasebook.search.empty": "Aucune expression ne correspond à votre recherche pour l’instant.",
      "subscription.title": "Passez en Premium",
      "subscription.subtitle":
        "Accédez au Trend Decoder complet, à des guides exclusifs et à des conseils personnalisés.",
      "subscription.price": "1,90€ / mois après l'essai gratuit de 7 jours",
      "subscription.cta": "Activer l'abonnement",
      "subscription.loading": "Redirection…",
      "subscription.warning":
        "Stripe nécessite un endpoint sécurisé côté serveur. Configurez `/api/create-checkout-session` ou mettez à jour `VITE_STRIPE_CHECKOUT_ENDPOINT`.",
      "subscription.active":
        "Premium activé pour cette session (pensez à confirmer via webhook côté serveur).",
      "subscription.disabledNotice":
        "Paiement en cours de préparation. Revenez bientôt pour activer Decorée Premium.",
      "subscription.disabledMessage":
        "Le paiement n'est pas encore disponible. Merci pour votre patience !",
      "subscription.disabledCta": "Paiement en préparation",
      "subscription.missingPrice":
        "Aucun Price ID Stripe n'est configuré. Contactez l'équipe Décorée.",
      "footer.madeIn": "Conçu à Séoul pour les voyageurs français",
      "admin.title": "Studio Décorée",
      "admin.subtitle":
        "Ajoutez de nouveaux lieux, événements et expressions sans écrire une ligne de code. Les entrées sont enregistrées dans votre navigateur et visibles immédiatement sur le site.",
      "admin.stats.trends": "Tendances publiées: {count}",
      "admin.stats.events": "Événements publiés: {count}",
      "admin.stats.phrases": "Expressions publiées: {count}",
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
      "admin.form.imageUrl": "Image (URL)",
      "admin.form.content": "Contenu long (séparez par un saut de ligne)",
      "admin.form.intensity.highlight": "Highlight (immanquable)",
      "admin.form.intensity.insider": "Insider (initiés)",
      "admin.form.intensity.emerging": "Emergent (tendance naissante)",
      "admin.form.isPremium": "Contenu premium",
      "admin.form.saving": "Enregistrement…",
      "admin.form.location": "Adresse / Station proche",
      "admin.form.price": "Tarif (ex: 49€ ou Entrée libre)",
      "admin.form.bookingUrl": "Lien de réservation (optionnel)",
      "admin.form.longDescription": "Description longue (séparez par un saut de ligne)",
      "admin.form.tips": "Conseils pratiques (1 par ligne)",
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
      "auth.adminOnlyCta": "Retour à l'accueil",
      "trendDetail.notFound": "Tendance introuvable",
      "trendDetail.notFoundSubtitle": "Le lien consulté n'est plus actif ou a été déplacé.",
      "trendDetail.goBack": "Retour",
      "trendDetail.back": "Retour",
      "trendDetail.sidebarTitle": "En bref",
      "trendDetail.neighborhood": "Quartier",
      "trendDetail.intensity": "Vibe",
      "trendDetail.intensity.highlight": "À ne pas manquer",
      "trendDetail.intensity.insider": "Insider",
      "trendDetail.intensity.emerging": "Tendance émergente",
      "trendDetail.published": "Publié",
      "trendDetail.backToList": "Retour aux tendances",
      "trendDetail.subscribeCta": "Débloquer tout le Decoder",
      "trendDetail.lockedTitle": "Réservé aux abonnés Premium",
      "trendDetail.lockedSubtitle":
        "Ce reportage est accessible après activation de votre abonnement Decorée Premium.",
      "trendDetail.unlockButton": "Activer le Premium",
      "eventDetail.notFound": "Événement introuvable",
      "eventDetail.notFoundSubtitle": "L'événement a peut-être été supprimé ou reporté.",
      "eventDetail.goBack": "Retour",
      "eventDetail.back": "Retour",
      "eventDetail.tipsTitle": "À savoir avant d'y aller",
      "eventDetail.infoTitle": "Infos pratiques",
      "eventDetail.when": "Date",
      "eventDetail.where": "Lieu",
      "eventDetail.price": "Tarif",
      "eventDetail.bookingCta": "Réserver maintenant",
      "eventDetail.backToList": "Voir d'autres événements",
      "eventDetail.discoverTrends": "Explorer le Trend Decoder"
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
      "hero.ribbon": "Decorée MVP",
      "hero.card.title": "Weekly Trend Decoder",
      "hero.card.subtitle": "한강 선셋 마켓 팝업",
      "hero.card.caption": "Stripe · Firebase · Google Maps 연동 준비 완료",
      "hero.spotlight.title": "Decorée 추천",
      "hero.spotlight.tag.trend": "트렌드 리포트",
      "hero.spotlight.tag.event": "이벤트 캘린더",
      "hero.spotlight.tag.phrase": "맞춤형 회화",
      "hero.spotlight.cta.trend": "자세히 읽기",
      "hero.spotlight.cta.event": "지금 예약하기",
      "hero.spotlight.cta.phrase": "표현 익히기",
      "hero.spotlight.disclaimer": "프리미엄 콘텐츠는 Decorée 구독자에게 제공됩니다.",
      "trends.title": "주간 트렌드 해독 리포트",
      "trends.subtitle": "프랑스 여행자를 위한 심층 소비 트렌드 분석.",
      "trends.premiumBadge": "프리미엄",
      "trends.unlock": "구독으로 전체 보기",
      "trends.sample": "무료 미리보기",
      "trends.readMore": "자세히 보기",
      "events.title": "K-컬처 이벤트 캘린더",
      "events.subtitle": "여행 일정에 맞는 공연, 축제, 팝업을 검색하세요.",
      "events.filter.label": "유형 선택",
      "events.filter.all": "전체",
      "events.empty": "조건에 맞는 이벤트가 없습니다.",
      "event.eventCategory.concert": "콘서트 / K-Pop",
      "event.eventCategory.traditional": "전통 공연",
      "event.eventCategory.pop-up": "팝업 / 클래스",
      "event.eventCategory.festival": "페스티벌",
      "eventDetail.readMore": "자세히 보기",
      "phrasebook.title": "맞춤형 한국어 회화장",
      "phrasebook.subtitle": "관심사를 선택하고 필수 표현과 문화 팁을 익히세요.",
      "phrasebook.category.food": "맛집 & 식문화",
      "phrasebook.category.shopping": "쇼핑",
      "phrasebook.category.entertainment": "문화·엔터",
      "phrasebook.completed": "학습한 표현",
      "phrasebook.search.label": "표현 검색",
      "phrasebook.search.placeholder": "예: 디저트, 쇼핑, 감사합니다…",
      "phrasebook.search.clear": "지우기",
      "phrasebook.search.empty": "조건에 맞는 표현이 없습니다. 다른 키워드로 검색해 보세요.",
      "subscription.title": "프리미엄으로 업그레이드",
      "subscription.subtitle":
        "트렌드 전체 리포트와 독점 가이드, 맞춤 추천을 이용해 보세요.",
      "subscription.price": "7일 무료 체험 후 월 1.90€",
      "subscription.cta": "구독 시작하기",
      "subscription.loading": "리디렉션 중…",
      "subscription.warning":
        "Stripe 결제는 서버(Cloud Functions 등)에 `/api/create-checkout-session` 엔드포인트를 설정해야 합니다.",
      "subscription.active": "이 세션에서 프리미엄이 활성화되었습니다 (웹훅으로 최종 확인해야 합니다).",
      "subscription.disabledNotice":
        "결제 기능 준비 중입니다. 조금만 기다려 주세요!",
      "subscription.disabledMessage":
        "결제 기능이 아직 열려 있지 않습니다. 준비가 되는 대로 안내드릴게요.",
      "subscription.disabledCta": "결제 준비중",
      "subscription.missingPrice": "Stripe Price ID가 설정되지 않았습니다. 운영팀에 문의해 주세요.",
      "footer.madeIn": "프랑스 여행자를 위해 서울에서 제작",
      "admin.title": "Decorée 콘텐츠 스튜디오",
      "admin.subtitle":
        "코드를 몰라도 새 트렌드, 이벤트, 표현을 바로 등록할 수 있습니다. 이 브라우저에 저장되고 즉시 웹앱에 반영됩니다.",
      "admin.stats.trends": "등록된 트렌드: {count}건",
      "admin.stats.events": "등록된 이벤트: {count}건",
      "admin.stats.phrases": "등록된 표현: {count}건",
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
      "admin.form.imageUrl": "대표 이미지 URL",
      "admin.form.content": "본문 (문단마다 한 줄 띄우기)",
      "admin.form.intensity.highlight": "하이라이트 (꼭 방문)",
      "admin.form.intensity.insider": "인사이더 (로컬 추천)",
      "admin.form.intensity.emerging": "이머징 (요즘 뜨는 곳)",
      "admin.form.isPremium": "프리미엄 콘텐츠",
      "admin.form.saving": "저장 중…",
      "admin.form.location": "위치 / 인근 역",
      "admin.form.price": "가격 (예: 49€ 또는 무료)",
      "admin.form.bookingUrl": "예약 링크 (선택)",
      "admin.form.longDescription": "상세 소개 (문단마다 한 줄 띄우기)",
      "admin.form.tips": "꿀팁 (한 줄에 하나씩)",
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
      "auth.adminOnlyCta": "홈으로 돌아가기",
      "trendDetail.notFound": "트렌드를 찾을 수 없습니다",
      "trendDetail.notFoundSubtitle": "링크가 만료되었거나 다른 위치로 이동했습니다.",
      "trendDetail.goBack": "뒤로가기",
      "trendDetail.back": "뒤로가기",
      "trendDetail.sidebarTitle": "핵심 정보",
      "trendDetail.neighborhood": "지역",
      "trendDetail.intensity": "분위기",
      "trendDetail.intensity.highlight": "놓치면 아쉬운 핫플",
      "trendDetail.intensity.insider": "로컬 추천",
      "trendDetail.intensity.emerging": "떠오르는 트렌드",
      "trendDetail.published": "발행일",
      "trendDetail.backToList": "트렌드 목록으로",
      "trendDetail.subscribeCta": "전체 리포트 보기",
      "trendDetail.lockedTitle": "프리미엄 전용 콘텐츠",
      "trendDetail.lockedSubtitle": "이 리포트는 Decorée 프리미엄을 활성화한 뒤 열람할 수 있습니다.",
      "trendDetail.unlockButton": "프리미엄 활성화",
      "eventDetail.notFound": "이벤트를 찾을 수 없습니다",
      "eventDetail.notFoundSubtitle": "이벤트가 삭제되었거나 일정이 변경되었습니다.",
      "eventDetail.goBack": "뒤로가기",
      "eventDetail.back": "뒤로가기",
      "eventDetail.tipsTitle": "가기 전에 확인하세요",
      "eventDetail.infoTitle": "기본 정보",
      "eventDetail.when": "일시",
      "eventDetail.where": "장소",
      "eventDetail.price": "가격",
      "eventDetail.bookingCta": "예약하기",
      "eventDetail.backToList": "다른 이벤트 보기",
      "eventDetail.discoverTrends": "트렌드 리포트 보기"
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
