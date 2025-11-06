import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type SupportedLanguage = "fr" | "ko" | "ja";

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
      "nav.cultureTest": "Test culture Corée",
      "nav.explore": "Explorer",
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
      "hero.highlights.title": "Decorée en un clin d'œil",
      "hero.highlights.cta": "Découvrir",
      "hero.highlights.trends.title": "Trend Decoder",
      "hero.highlights.trends.description": "Consultez notre analyse hebdomadaire en français.",
      "hero.highlights.events.title": "Calendrier K-Culture",
      "hero.highlights.events.description": "Planifiez concerts, festivals et pop-ups selon vos dates.",
      "hero.highlights.phrasebook.title": "Phrasebook personnalisé",
      "hero.highlights.phrasebook.description":
        "Retrouvez des expressions clés avec audio et notes culturelles.",
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
      "cultureTest.badge": "Quiz K-Culture",
      "cultureTest.title": "Quel voyageur de Corée êtes-vous ?",
      "cultureTest.subtitle":
        "Répondez à 5 questions et obtenez un profil Decorée avec des idées de tendances, d’événements et d’expressions à tester sur place.",
      "cultureTest.progress.complete": "Résultat personnalisé prêt !",
      "cultureTest.progress.step": "Question {current}/{total}",
      "cultureTest.progress.helper": "Une seule réponse par question, suivez votre intuition.",
      "cultureTest.actions.previous": "Précédent",
      "cultureTest.actions.reset": "Réinitialiser",
      "cultureTest.actions.submit": "Voir mon résultat",
      "cultureTest.actions.next": "Suivant",
      "cultureTest.actions.share": "Partager mon profil",
      "cultureTest.actions.retry": "Recommencer",
      "cultureTest.share.title": "Quiz Decorée",
      "cultureTest.share.text": "Mon profil Decorée : {result}. Et toi, quel voyageur de Corée es-tu ?",
      "cultureTest.share.copied": "Lien copié !",
      "cultureTest.share.error": "Impossible de partager pour le moment.",
      "cultureTest.hint.title": "Comment fonctionne le test ?",
      "cultureTest.hint.subtitle":
        "Chaque réponse alimente les quatre profils voyageurs imaginés par Decorée.",
      "cultureTest.hint.item.1": "Pas de bonne ou mauvaise réponse : écoutez votre vibe du moment.",
      "cultureTest.hint.item.2":
        "Les résultats mixent tendances, gastronomie, patrimoine et slow travel.",
      "cultureTest.hint.item.3":
        "Vous pouvez revenir en arrière ou recommencer complètement quand vous voulez.",
      "cultureTest.result.badge": "Votre profil Decorée",
      "cultureTest.result.highlight": "À explorer",
      "cultureTest.result.next.title": "Envie d'aller plus loin ?",
      "cultureTest.result.next.subtitle":
        "Trouvez des tendances, événements et expressions qui collent à votre vibe.",
      "cultureTest.questions.pace.title": "Premier jour à Séoul : votre rythme idéal ?",
      "cultureTest.questions.pace.subtitle": "Choisissez le scénario qui vous ressemble le plus.",
      "cultureTest.questions.pace.answers.trendsetter":
        "Je saute d'une ouverture pop-up à une collab K-pop.",
      "cultureTest.questions.pace.answers.foodie":
        "Je commence par un marché local et un petit-déj street food.",
      "cultureTest.questions.pace.answers.wellness":
        "Je file voir le lever du soleil au parc puis un café slow.",
      "cultureTest.questions.pace.answers.heritage":
        "Je prends le temps de flâner entre palais et ruelles hanok.",
      "cultureTest.questions.morning.title": "Votre première réservation avant le départ ?",
      "cultureTest.questions.morning.subtitle": "L'activité qui s'impose dans votre planning.",
      "cultureTest.questions.morning.answers.trendsetter":
        "Une table dans le nouveau resto conceptuel de Seongsu.",
      "cultureTest.questions.morning.answers.foodie":
        "Un cours de kimchi ou un tour de tteokbokki nocturne.",
      "cultureTest.questions.morning.answers.wellness":
        "Un jjimjilbang chic avec massage inclus.",
      "cultureTest.questions.morning.answers.heritage":
        "Un atelier de hanji, calligraphie ou un hanbok sur mesure.",
      "cultureTest.questions.souvenir.title": "Quel souvenir ramenez-vous absolument ?",
      "cultureTest.questions.souvenir.subtitle":
        "Celui que vous glisserez dans votre valise cabine.",
      "cultureTest.questions.souvenir.answers.trendsetter":
        "Un drop limité signé par une marque locale en vogue.",
      "cultureTest.questions.souvenir.answers.foodie":
        "Des sauces artisanales, gochujang ou sel de mer de Jeju.",
      "cultureTest.questions.souvenir.answers.wellness":
        "Des soins clean beauty à base de thé vert et yuzu.",
      "cultureTest.questions.souvenir.answers.heritage":
        "De la céramique ou un sceau personnalisé gravé.",
      "cultureTest.questions.evening.title": "Votre soirée parfaite à Séoul ?",
      "cultureTest.questions.evening.subtitle": "Ce que vous postez en story.",
      "cultureTest.questions.evening.answers.trendsetter":
        "Un rooftop à Hongdae, playlist K-hip-hop et city lights.",
      "cultureTest.questions.evening.answers.foodie":
        "Un marathon pojangmacha puis dessert bingsu.",
      "cultureTest.questions.evening.answers.wellness":
        "Un bain de nuit à l'observatoire, thé et skyline paisible.",
      "cultureTest.questions.evening.answers.heritage":
        "Un spectacle au National Theater puis promenade sur Cheonggyecheon illuminé.",
      "cultureTest.questions.motto.title": "Votre mantra de voyage ?",
      "cultureTest.questions.motto.subtitle": "La phrase qui résume votre vibe.",
      "cultureTest.questions.motto.answers.trendsetter":
        "\"Si c'est sur TikTok aujourd'hui, je le vis demain.\"",
      "cultureTest.questions.motto.answers.foodie":
        "\"On goûte tout, du marché aux tables étoilées.\"",
      "cultureTest.questions.motto.answers.wellness":
        "\"On ralentit pour sentir la ville respirer.\"",
      "cultureTest.questions.motto.answers.heritage":
        "\"Chaque quartier a une histoire à raconter.\"",
      "cultureTest.results.trendsetter.title": "Trendsetter séoulite",
      "cultureTest.results.trendsetter.description":
        "Toujours à l'affût des concepts hybrides, vous transformez chaque voyage en moodboard vivant. Vous vibrez pour Seongsu, Hannam ou Yeonnam et vous inspirez votre cercle avec des trouvailles inédites.",
      "cultureTest.results.trendsetter.highlights.1":
        "Réservez un créneau dans les pop-ups mode/culture du moment (chapters de Seongsu, espace DDP…).",
      "cultureTest.results.trendsetter.highlights.2":
        "Ajoutez un café signature et une expo immersive pour nourrir votre feed.",
      "cultureTest.results.trendsetter.highlights.3":
        "Suivez notre Trend Decoder pour ne rater aucun lancement collab.",
      "cultureTest.results.foodie.title": "Explorateur·rice K-Food",
      "cultureTest.results.foodie.description":
        "Vous cartographiez la Corée par le goût : marchés, pop-up food, tables néo-traditionnelles et desserts XXL. Chaque repas devient un récit.",
      "cultureTest.results.foodie.highlights.1":
        "Planifiez un tour street-food à Gwangjang puis une dégustation dans un bistro hansik moderne.",
      "cultureTest.results.foodie.highlights.2":
        "Passez chez les artisans du sur mesure : jang, thé, confiseries.",
      "cultureTest.results.foodie.highlights.3":
        "Notez vos coups de cœur dans le Phrasebook pour les retrouver sur place.",
      "cultureTest.results.wellness.title": "Voyageur·se slow & healing",
      "cultureTest.results.wellness.description":
        "Vous cherchez la face apaisée de la Corée : forêts urbaines, sources chaudes, cafés calmes et rituels bien-être.",
      "cultureTest.results.wellness.highlights.1":
        "Combinez un jjimjilbang design, un tea house et une méditation sur Bugaksan.",
      "cultureTest.results.wellness.highlights.2":
        "Direction les cafés ressourçants de Seochon, Ikseon ou Gapado si vous prolongez.",
      "cultureTest.results.wellness.highlights.3":
        "Consultez notre Event Calendar pour les retraites et ateliers respiration.",
      "cultureTest.results.heritage.title": "Storyteller patrimonial",
      "cultureTest.results.heritage.description":
        "Votre curiosité vous mène vers les quartiers historiques, les artisans et les spectacles traditionnels. Vous construisez un carnet de voyage riche en histoires.",
      "cultureTest.results.heritage.highlights.1":
        "Réservez une visite guidée à Bukchon, un atelier hanji et un spectacle de pansori.",
      "cultureTest.results.heritage.highlights.2":
        "Flânez dans les musées alternatifs et galeries dédiées à l'artisanat coréen.",
      "cultureTest.results.heritage.highlights.3":
        "Utilisez notre Trend Decoder pour dénicher les résidences artistiques ouvertes.",
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
      "eventDetail.discoverTrends": "Explorer le Trend Decoder",
      "japaneseLanding.badge": "Decorée pour le Japon",
      "japaneseLanding.hero.title": "Bienvenue sur Decorée, la K-culture en japonais",
      "japaneseLanding.hero.subtitle":
        "Basée à Séoul, l'équipe Decorée rassemble pour le public japonais les tendances, événements et conseils essentiels.",
      "japaneseLanding.hero.primary": "Accéder à la version japonaise",
      "japaneseLanding.hero.secondary": "Voir la version française",
      "japaneseLanding.overview.title": "Ce que propose Decorée",
      "japaneseLanding.overview.items.trend.title": "Trend Decoder hebdo",
      "japaneseLanding.overview.items.trend.description":
        "Pop-up, collaborations K-culture, ambiance quartier : un digest en japonais pour préparer votre voyage.",
      "japaneseLanding.overview.items.event.title": "Calendrier K-culture",
      "japaneseLanding.overview.items.event.description":
        "Concerts, festivals et spectacles traditionnels filtrés par dates et quartiers.",
      "japaneseLanding.overview.items.phrase.title": "Phrasebook voyage & culture",
      "japaneseLanding.overview.items.phrase.description":
        "Expressions clés avec prononciation et notes culturelles disponibles en japonais.",
      "japaneseLanding.cta.title": "Découvrez la Corée avec Decorée",
      "japaneseLanding.cta.subtitle":
        "Nous accompagnons les voyageurs japonais passionnés de tendances et de patrimoine coréen.",
      "japaneseLanding.cta.button": "Lire les tendances récentes",
      "japaneseLanding.resources.title": "Et ensuite ?",
      "japaneseLanding.resources.items.cultureTest":
        "Essayez notre test culture pour connaître votre profil Decorée.",
      "japaneseLanding.resources.items.phrasebook":
        "Parcourez le Phrasebook et enregistrez vos expressions favorites.",
      "japaneseLanding.resources.items.events":
        "Consultez le calendrier pour planifier vos sorties K-culture."
    }
  },
  ko: {
    label: "한국어",
    messages: {
      "nav.home": "홈",
      "nav.trends": "트렌드 리포트",
      "nav.events": "이벤트 캘린더",
      "nav.phrasebook": "맞춤형 회화",
      "nav.cultureTest": "한국 문화 테스트",
      "nav.explore": "콘텐츠 탐색",
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
      "hero.highlights.title": "Decorée 한눈에 보기",
      "hero.highlights.cta": "자세히 보기",
      "hero.highlights.trends.title": "트렌드 리포트",
      "hero.highlights.trends.description": "프랑스어로 정리된 주간 인사이트.",
      "hero.highlights.events.title": "K-컬처 캘린더",
      "hero.highlights.events.description": "공연·페스티벌 일정을 한 번에 확인하세요.",
      "hero.highlights.phrasebook.title": "맞춤형 회화장",
      "hero.highlights.phrasebook.description": "상황별 표현과 문화 팁을 저장해 두세요.",
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
      "cultureTest.badge": "K-컬처 MBTI",
      "cultureTest.title": "당신은 어떤 한국 여행자일까요?",
      "cultureTest.subtitle":
        "5개의 질문으로 나만의 여행 페르소나를 찾아보세요. Decorée에서 바로 즐길 수 있는 맞춤 추천을 보여드릴게요.",
      "cultureTest.progress.complete": "맞춤 추천이 준비됐어요!",
      "cultureTest.progress.step": "{current}/{total}번 질문",
      "cultureTest.progress.helper": "한 가지를 골라 직감을 믿어보세요.",
      "cultureTest.actions.previous": "이전",
      "cultureTest.actions.reset": "전체 초기화",
      "cultureTest.actions.submit": "결과 보기",
      "cultureTest.actions.next": "다음",
      "cultureTest.actions.share": "결과 공유하기",
      "cultureTest.actions.retry": "다시 테스트하기",
      "cultureTest.share.title": "Decorée 여행 페르소나",
      "cultureTest.share.text": "Decorée 테스트 결과: {result}. 당신의 한국 여행 페르소나는 무엇인가요?",
      "cultureTest.share.copied": "링크가 복사되었습니다!",
      "cultureTest.share.error": "공유에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      "cultureTest.hint.title": "테스트 이용 방법",
      "cultureTest.hint.subtitle": "각 답변은 Decorée가 정리한 네 가지 여행 성향 데이터와 연결됩니다.",
      "cultureTest.hint.item.1": "정답은 없어요. 지금 끌리는 장면을 고르세요.",
      "cultureTest.hint.item.2": "트렌드, 미식, 힐링, 헤리티지를 입체적으로 분석해 드려요.",
      "cultureTest.hint.item.3": "언제든지 이전으로 돌아가거나 전체를 초기화할 수 있어요.",
      "cultureTest.result.badge": "나의 Decorée 페르소나",
      "cultureTest.result.highlight": "추천 포인트",
      "cultureTest.result.next.title": "다음으로 할 일",
      "cultureTest.result.next.subtitle": "페르소나에 맞는 트렌드·이벤트·회화장을 계속 발견해 보세요.",
      "cultureTest.questions.pace.title": "서울 첫날, 어떤 템포로 움직이나요?",
      "cultureTest.questions.pace.subtitle": "가장 끌리는 장면을 골라 주세요.",
      "cultureTest.questions.pace.answers.trendsetter":
        "오픈런으로 플래그십과 팝업을 연달아 방문!",
      "cultureTest.questions.pace.answers.foodie":
        "재래시장과 길거리 간식으로 에너지 충전.",
      "cultureTest.questions.pace.answers.wellness":
        "공원 일출 산책 후 잔잔한 스페셜티 카페.",
      "cultureTest.questions.pace.answers.heritage":
        "궁과 한옥 골목을 천천히 거닐며 시작.",
      "cultureTest.questions.morning.title": "가장 먼저 예약하는 일정은?",
      "cultureTest.questions.morning.subtitle": "여행 계획에 꼭 넣는 체험을 선택하세요.",
      "cultureTest.questions.morning.answers.trendsetter":
        "성수의 하이브리드 다이닝·콘셉트 레스토랑.",
      "cultureTest.questions.morning.answers.foodie":
        "김치 클래스 또는 야간 떡볶이 투어.",
      "cultureTest.questions.morning.answers.wellness":
        "찜질방 & 마사지, 힐링 스케줄.",
      "cultureTest.questions.morning.answers.heritage":
        "한지·서예 등 장인 클래스 혹은 맞춤 한복.",
      "cultureTest.questions.souvenir.title": "꼭 챙겨오는 기념품은?",
      "cultureTest.questions.souvenir.subtitle": "기내용 가방에 들어갈 아이템을 떠올려 보세요.",
      "cultureTest.questions.souvenir.answers.trendsetter":
        "로컬 브랜드 한정 출시 아이템.",
      "cultureTest.questions.souvenir.answers.foodie":
        "수제 고추장, 장아찌, 프리미엄 식재료.",
      "cultureTest.questions.souvenir.answers.wellness":
        "그린티·유자 기반 클린 뷰티 제품.",
      "cultureTest.questions.souvenir.answers.heritage":
        "공예 도자기 또는 전각(도장) 맞춤 제작.",
      "cultureTest.questions.evening.title": "이상적인 서울의 밤은?",
      "cultureTest.questions.evening.subtitle": "스토리로 남기고 싶은 순간은 무엇인가요?",
      "cultureTest.questions.evening.answers.trendsetter":
        "홍대·이태원 루프탑에서 K-힙합과 네온 뷰.",
      "cultureTest.questions.evening.answers.foodie":
        "포장마차 투어 후 빙수로 마무리.",
      "cultureTest.questions.evening.answers.wellness":
        "전망대 야간 온천 & 티 타임.",
      "cultureTest.questions.evening.answers.heritage":
        "국립극장 공연 후 청계천 야경 산책.",
      "cultureTest.questions.motto.title": "여행 모토는?",
      "cultureTest.questions.motto.subtitle": "당신의 여행 톤앤매너를 보여줄 문장을 골라보세요.",
      "cultureTest.questions.motto.answers.trendsetter":
        "\"오늘의 트렌드는 내일 바로 경험한다.\"",
      "cultureTest.questions.motto.answers.foodie":
        "\"시장부터 파인다이닝까지 맛은 빠짐없이.\"",
      "cultureTest.questions.motto.answers.wellness":
        "\"천천히 걸으면 도시의 숨결이 들린다.\"",
      "cultureTest.questions.motto.answers.heritage":
        "\"모든 동네엔 이야기와 기억이 있다.\"",
      "cultureTest.results.trendsetter.title": "서울 트렌드세터",
      "cultureTest.results.trendsetter.description":
        "새로운 컨셉과 협업에 가장 먼저 반응하는 타입. 성수·한남·연남을 무대로 여행을 무드보드처럼 기록하고, 주변에게 신상 인사이트를 전해요.",
      "cultureTest.results.trendsetter.highlights.1":
        "성수, DDP 등 요즘 뜨는 팝업과 플래그십 예약 알림을 켜 두세요.",
      "cultureTest.results.trendsetter.highlights.2":
        "무드 있는 시그니처 카페와 몰입형 전시를 일정에 추가하세요.",
      "cultureTest.results.trendsetter.highlights.3":
        "Trend Decoder를 구독하면 가장 빠른 런칭 정보를 받을 수 있어요.",
      "cultureTest.results.foodie.title": "K-푸드 탐험가",
      "cultureTest.results.foodie.description":
        "시장부터 네오-한식과 디저트까지 맛으로 여행을 설계합니다. 한 끼마다 이야기를 만들고 기록해요.",
      "cultureTest.results.foodie.highlights.1":
        "광장시장 스트리트푸드와 모던 한식 다이닝을 하루 코스로 엮어보세요.",
      "cultureTest.results.foodie.highlights.2":
        "장(발효 소스), 차, 전통 과자 등 장인 매장을 탐방해 보세요.",
      "cultureTest.results.foodie.highlights.3":
        "Phrasebook 표현을 미리 저장하고 맛집에서 자연스럽게 사용해 보세요.",
      "cultureTest.results.wellness.title": "슬로우 힐링 여행자",
      "cultureTest.results.wellness.description":
        "도시 속 숲과 온천, 잔잔한 카페를 찾아 몸과 마음을 회복합니다. 느린 속도로 한국을 느끼는 타입이에요.",
      "cultureTest.results.wellness.highlights.1":
        "디자인 찜질방, 티 하우스, 북악산 명상 코스를 조합해 보세요.",
      "cultureTest.results.wellness.highlights.2":
        "서촌·익선·가파도 등 로컬 힐링 스폿을 체크해 보세요.",
      "cultureTest.results.wellness.highlights.3":
        "Event Calendar에서 요가·호흡 워크숍을 찾아보세요.",
      "cultureTest.results.heritage.title": "헤리티지 스토리텔러",
      "cultureTest.results.heritage.description":
        "역사적 공간과 장인, 전통 공연에 끌리는 타입. 기록을 남기며 이야기를 수집해요.",
      "cultureTest.results.heritage.highlights.1":
        "북촌 해설 투어, 한지 공방, 판소리 공연을 예약해 보세요.",
      "cultureTest.results.heritage.highlights.2":
        "대안 전시관과 공예 갤러리를 여유롭게 둘러보세요.",
      "cultureTest.results.heritage.highlights.3":
        "Trend Decoder에서 레지던시·아티스트 이벤트를 확인하세요.",
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
      "eventDetail.discoverTrends": "트렌드 리포트 보기",
      "japaneseLanding.badge": "Decorée for Japan",
      "japaneseLanding.hero.title": "일본 사용자를 위한 Decorée에 오신 것을 환영합니다",
      "japaneseLanding.hero.subtitle":
        "서울 기반 Decorée 팀이 일본 여행자를 위해 최신 트렌드와 이벤트, 여행 꿀팁을 일본어로 정리했습니다.",
      "japaneseLanding.hero.primary": "일본어 버전으로 보기",
      "japaneseLanding.hero.secondary": "프랑스어 버전 보기",
      "japaneseLanding.overview.title": "Decorée가 드리는 서비스",
      "japaneseLanding.overview.items.trend.title": "주간 트렌드 리포트",
      "japaneseLanding.overview.items.trend.description":
        "현지에서 화제인 팝업과 협업, 동네 무드를 일본어로 요약해 드립니다.",
      "japaneseLanding.overview.items.event.title": "K-컬처 캘린더",
      "japaneseLanding.overview.items.event.description":
        "공연, 페스티벌, 전통 공연을 날짜와 지역별로 손쉽게 확인하세요.",
      "japaneseLanding.overview.items.phrase.title": "여행 & 문화 한국어",
      "japaneseLanding.overview.items.phrase.description":
        "상황별 표현과 문화 메모를 일본어·한글·발음과 함께 제공합니다.",
      "japaneseLanding.cta.title": "Decorée와 함께 더 가까워지는 한국 여행",
      "japaneseLanding.cta.subtitle":
        "트렌드를 사랑하고 한일 문화 연결을 꿈꾸는 여러분을 위한 맞춤 허브입니다.",
      "japaneseLanding.cta.button": "최신 트렌드 읽어보기",
      "japaneseLanding.resources.title": "다음 단계",
      "japaneseLanding.resources.items.cultureTest":
        "한국 문화 테스트로 나의 여행 페르소나를 확인하세요.",
      "japaneseLanding.resources.items.phrasebook":
        "프레이즈북에서 상황별 한국어 표현을 미리 익혀보세요.",
      "japaneseLanding.resources.items.events":
        "이벤트 캘린더로 방문 시기에 맞는 K-컬처를 찾아보세요."
    }
  },
  ja: {
    label: "日本語",
    messages: {
      "nav.home": "ホーム",
      "nav.trends": "トレンドデコーダー",
      "nav.events": "Kカルチャーカレンダー",
      "nav.phrasebook": "パーソナル会話帳",
      "nav.cultureTest": "韓国カルチャーテスト",
      "nav.explore": "ディスカバー",
      "nav.subscribe": "プレミアム登録",
      "nav.admin": "Decoréeスタジオ",
      "auth.login": "ログイン",
      "auth.logout": "ログアウト",
      "auth.signup": "アカウント作成",
      "hero.title": "言葉の壁なしで韓国を旅しよう",
      "hero.subtitle":
        "最新トレンド分析、Kカルチャーイベント、興味別の韓国語フレーズを日本語でお届けします。",
      "hero.cta.primary": "トレンドを読む",
      "hero.cta.secondary": "新着を見る",
      "hero.highlights.title": "Decoréeを一目で",
      "hero.highlights.cta": "もっと見る",
      "hero.highlights.trends.title": "トレンドデコーダー",
      "hero.highlights.trends.description": "日本語で読める週間トレンド分析。",
      "hero.highlights.events.title": "Kカルチャーカレンダー",
      "hero.highlights.events.description": "コンサートやポップアップをまとめてチェック。",
      "hero.highlights.phrasebook.title": "パーソナル会話帳",
      "hero.highlights.phrasebook.description": "シーン別フレーズとカルチャーメモを保存。",
      "hero.ribbon": "Decorée MVP",
      "hero.card.title": "Weekly Trend Decoder",
      "hero.card.subtitle": "漢江サンセットマーケット ポップアップ",
      "hero.card.caption": "Stripe・Firebase・Google Mapsの連携準備OK。",
      "hero.spotlight.title": "Decoréeおすすめ",
      "hero.spotlight.tag.trend": "トレンドレポート",
      "hero.spotlight.tag.event": "イベントカレンダー",
      "hero.spotlight.tag.phrase": "パーソナル会話帳",
      "hero.spotlight.cta.trend": "特集を読む",
      "hero.spotlight.cta.event": "席を予約する",
      "hero.spotlight.cta.phrase": "フレーズを学ぶ",
      "hero.spotlight.disclaimer": "プレミアムコンテンツはDecorée会員限定です。",
      "trends.title": "週間トレンドデコーダー",
      "trends.subtitle": "日本のトラベラー向けに、韓国の消費トレンドを深掘りします。",
      "trends.premiumBadge": "プレミアム",
      "trends.unlock": "購読して全て読む",
      "trends.sample": "無料サンプルを見る",
      "trends.readMore": "レポートを読む",
      "events.title": "Kカルチャー イベントカレンダー",
      "events.subtitle": "旅行日程に合わせてコンサート、フェス、ポップアップを検索。",
      "events.filter.label": "タイプを選択",
      "events.filter.all": "すべて",
      "events.empty": "条件に合うイベントが見つかりません。",
      "event.eventCategory.concert": "コンサート / K-Pop",
      "event.eventCategory.traditional": "伝統芸能",
      "event.eventCategory.pop-up": "ポップアップ / クラス",
      "event.eventCategory.festival": "フェスティバル",
      "eventDetail.readMore": "イベント詳細へ",
      "phrasebook.title": "パーソナル韓国語フレーズ帳",
      "phrasebook.subtitle": "興味を選んで、音声とカルチャーメモ付きの必須表現を練習。",
      "phrasebook.category.food": "グルメ",
      "phrasebook.category.shopping": "ショッピング",
      "phrasebook.category.entertainment": "カルチャー・エンタメ",
      "phrasebook.completed": "学習済みフレーズ",
      "phrasebook.search.label": "フレーズ検索",
      "phrasebook.search.placeholder": "例: デザート, 쇼핑, 감사합니다…",
      "phrasebook.search.clear": "クリア",
      "phrasebook.search.empty": "該当するフレーズが見つかりません。別のキーワードをお試しください。",
      "cultureTest.badge": "KカルチャーMBTI",
      "cultureTest.title": "あなたはどんな韓国旅行タイプ？",
      "cultureTest.subtitle":
        "5つの質問に答えるだけで、Decoréeが提案する旅行ペルソナとおすすめプランがわかります。",
      "cultureTest.progress.complete": "パーソナル診断の準備が整いました！",
      "cultureTest.progress.step": "質問 {current}/{total}",
      "cultureTest.progress.helper": "直感で1つを選んでください。",
      "cultureTest.actions.previous": "前へ",
      "cultureTest.actions.reset": "すべてリセット",
      "cultureTest.actions.submit": "結果を見る",
      "cultureTest.actions.next": "次へ",
      "cultureTest.actions.share": "結果をシェア",
      "cultureTest.actions.retry": "再テスト",
      "cultureTest.share.title": "Decorée 旅行診断",
      "cultureTest.share.text": "私のDecorée診断結果: {result}。あなたはどのタイプ？",
      "cultureTest.share.copied": "リンクをコピーしました！",
      "cultureTest.share.error": "共有に失敗しました。少し待って再試行してください。",
      "cultureTest.hint.title": "テストのヒント",
      "cultureTest.hint.subtitle": "それぞれの回答が4つの旅行ペルソナに紐づきます。",
      "cultureTest.hint.item.1": "正解はありません。今の気分で選びましょう。",
      "cultureTest.hint.item.2": "トレンド・グルメ・ヒーリング・ヘリテージを総合的に分析します。",
      "cultureTest.hint.item.3": "いつでも戻る・リセットが可能です。",
      "cultureTest.result.badge": "あなたのDecoréeペルソナ",
      "cultureTest.result.highlight": "おすすめポイント",
      "cultureTest.result.next.title": "次のステップ",
      "cultureTest.result.next.subtitle": "ペルソナに合わせたトレンド・イベント・フレーズを見つけましょう。",
      "cultureTest.questions.pace.title": "ソウル初日、どんなペースで動きますか？",
      "cultureTest.questions.pace.subtitle": "一番ワクワクするシーンを選んでください。",
      "cultureTest.questions.pace.answers.trendsetter":
        "話題のフラッグシップとポップアップをハシゴ。",
      "cultureTest.questions.pace.answers.foodie":
        "ローカル市場と屋台グルメでスタート。",
      "cultureTest.questions.pace.answers.wellness":
        "公園で朝日を浴びてから静かなカフェへ。",
      "cultureTest.questions.pace.answers.heritage":
        "宮殿と韓屋路地をゆっくり散策。",
      "cultureTest.questions.morning.title": "出発前に必ず予約する体験は？",
      "cultureTest.questions.morning.subtitle": "旅に欠かせないアクティビティを選択。",
      "cultureTest.questions.morning.answers.trendsetter":
        "聖水のコンセプトレストラン。",
      "cultureTest.questions.morning.answers.foodie":
        "キムチクラスまたは夜のトッポッキツアー。",
      "cultureTest.questions.morning.answers.wellness":
        "チムジルバン＆マッサージのヒーリングコース。",
      "cultureTest.questions.morning.answers.heritage":
        "韓紙・書芸などのクラフト体験やオーダーメイド韓服。",
      "cultureTest.questions.souvenir.title": "必ず持ち帰るお土産は？",
      "cultureTest.questions.souvenir.subtitle": "機内持ち込みに入れるアイテムを想像して。",
      "cultureTest.questions.souvenir.answers.trendsetter":
        "人気ローカルブランドの限定アイテム。",
      "cultureTest.questions.souvenir.answers.foodie":
        "手作りコチュジャンやプレミアム調味料。",
      "cultureTest.questions.souvenir.answers.wellness":
        "緑茶・ゆずベースのクリーンビューティー。",
      "cultureTest.questions.souvenir.answers.heritage":
        "陶芸品またはオリジナル印章。",
      "cultureTest.questions.evening.title": "理想のソウルナイトは？",
      "cultureTest.questions.evening.subtitle": "SNSに残したいシーンを選択。",
      "cultureTest.questions.evening.answers.trendsetter":
        "弘大・梨泰院のルーフトップでKヒップホップと夜景。",
      "cultureTest.questions.evening.answers.foodie":
        "ポジャンマチャ巡りとパッピンスで締め。",
      "cultureTest.questions.evening.answers.wellness":
        "夜景温泉とお茶でゆったり。",
      "cultureTest.questions.evening.answers.heritage":
        "国立劇場の公演後に清渓川を散歩。",
      "cultureTest.questions.motto.title": "旅のモットーは？",
      "cultureTest.questions.motto.subtitle": "あなたの旅スタイルを表すフレーズを選択。",
      "cultureTest.questions.motto.answers.trendsetter":
        "「今日話題のものは明日体験する。」",
      "cultureTest.questions.motto.answers.foodie":
        "「市場からファインダイニングまで味わい尽くす。」",
      "cultureTest.questions.motto.answers.wellness":
        "「ゆっくり歩けば街の息遣いが聞こえる。」",
      "cultureTest.questions.motto.answers.heritage":
        "「すべての街角に物語がある。」",
      "cultureTest.results.trendsetter.title": "ソウルトレンドセッター",
      "cultureTest.results.trendsetter.description":
        "新しいコンセプトに敏感で、聖水・漢南・延南を舞台に旅をムードボードのように記録します。最新インサイトを周りへシェアするタイプ。",
      "cultureTest.results.trendsetter.highlights.1":
        "聖水やDDPなど話題のポップアップ予約通知をオンに。",
      "cultureTest.results.trendsetter.highlights.2":
        "シグネチャーカフェと没入型展示を行程に追加。",
      "cultureTest.results.trendsetter.highlights.3":
        "Trend Decoderを購読して最新ローンチ情報をキャッチ。",
      "cultureTest.results.foodie.title": "Kフード探検家",
      "cultureTest.results.foodie.description":
        "市場からネオ韓食、デザートまで“食”で旅をデザイン。各食体験をストーリーとして記録します。",
      "cultureTest.results.foodie.highlights.1":
        "広蔵市場のストリートフードとモダン韓食のディナーを1日に詰め込む。",
      "cultureTest.results.foodie.highlights.2":
        "発酵ジャン、茶、伝統菓子の職人ショップ巡り。",
      "cultureTest.results.foodie.highlights.3":
        "Phrasebookにフレーズを保存して現地で活用。",
      "cultureTest.results.wellness.title": "スローヒーリング旅人",
      "cultureTest.results.wellness.description":
        "都市の森や温泉、静かなカフェで心身を整える旅。ゆったりと韓国を感じるタイプ。",
      "cultureTest.results.wellness.highlights.1":
        "デザインチムジルバン、ティーハウス、北岳山の瞑想コースを組み合わせる。",
      "cultureTest.results.wellness.highlights.2":
        "西村・益善・加波島などローカルヒーリングスポットをチェック。",
      "cultureTest.results.wellness.highlights.3":
        "Event Calendarでヨガや呼吸ワークショップを探す。",
      "cultureTest.results.heritage.title": "ヘリテージストーリーテラー",
      "cultureTest.results.heritage.description":
        "歴史的スポットや職人、伝統公演に惹かれ、記録しながら物語を集めるタイプ。",
      "cultureTest.results.heritage.highlights.1":
        "北村のガイドツアー、韓紙工房、パンソリ公演を予約。",
      "cultureTest.results.heritage.highlights.2":
        "クラフト専門のギャラリーや代替スペースをゆっくり巡る。",
      "cultureTest.results.heritage.highlights.3":
        "Trend Decoderでレジデンスやアーティストイベントをチェック。",
      "subscription.title": "プレミアムへアップグレード",
      "subscription.subtitle":
        "トレンドレポート全文、限定ガイド、パーソナルアドバイスへアクセス。",
      "subscription.price": "7日間無料トライアル後 月額1.90€",
      "subscription.cta": "購読を開始",
      "subscription.loading": "リダイレクト中…",
      "subscription.warning":
        "Stripe決済にはサーバー側で`/api/create-checkout-session`エンドポイントを設定してください。",
      "subscription.active": "このセッションでプレミアムが有効になりました (Webhookで最終確認が必要です)。",
      "subscription.disabledNotice": "決済機能を準備中です。もう少しお待ちください！",
      "subscription.disabledMessage": "まだ決済はご利用いただけません。準備が整い次第お知らせします。",
      "subscription.disabledCta": "決済準備中",
      "subscription.missingPrice": "Stripe Price IDが設定されていません。運営チームへご連絡ください。",
      "footer.madeIn": "フランス人旅行者のためにソウルで設計",
      "admin.title": "Decorée コンテンツスタジオ",
      "admin.subtitle":
        "コード不要でトレンド・イベント・フレーズを即時公開。ブラウザに保存され、サイトへ即反映されます。",
      "admin.stats.trends": "登録済みトレンド: {count}件",
      "admin.stats.events": "登録済みイベント: {count}件",
      "admin.stats.phrases": "登録済みフレーズ: {count}件",
      "admin.session": "{email}としてログイン中",
      "admin.actions.reset": "このブラウザの追加分を初期化",
      "admin.feedback.trendSaved": "新しいトレンドを保存しました。",
      "admin.feedback.eventSaved": "新しいイベントを保存しました。",
      "admin.feedback.phraseSaved": "新しいフレーズを保存しました。",
      "admin.feedback.error": "エラーが発生しました。再度お試しください。",
      "admin.feedback.cleared": "このブラウザで追加したコンテンツを削除しました。",
      "admin.trend.title": "トレンドを追加",
      "admin.trend.description":
        "項目を入力して「保存」を押すと、Trend Decoderに即反映されます。",
      "admin.trend.submit": "トレンドを保存",
      "admin.event.title": "Kカルチャー イベントを追加",
      "admin.event.description": "旅行者がすぐ予約できるよう、主要情報を入力してください。",
      "admin.event.submit": "イベントを保存",
      "admin.event.category.concert": "コンサート / K-Pop",
      "admin.event.category.traditional": "伝統公演",
      "admin.event.category.popup": "ポップアップ / クラス",
      "admin.event.category.festival": "フェスティバル",
      "admin.phrase.title": "フレーズを追加",
      "admin.phrase.description": "現地で役立った表現を共有しましょう。会話帳に反映されます。",
      "admin.phrase.submit": "フレーズを保存",
      "admin.form.title": "タイトル",
      "admin.form.neighborhood": "エリア / 場所",
      "admin.form.summary": "概要 (最大2文)",
      "admin.form.details": "詳細説明",
      "admin.form.tags": "カンマ区切りのタグ",
      "admin.form.imageUrl": "メイン画像URL",
      "admin.form.content": "本文 (段落ごとに改行)",
      "admin.form.intensity.highlight": "ハイライト (必訪)",
      "admin.form.intensity.insider": "インサイダー (ローカル推し)",
      "admin.form.intensity.emerging": "エマージング (注目上昇)",
      "admin.form.isPremium": "プレミアムコンテンツ",
      "admin.form.saving": "保存中…",
      "admin.form.location": "住所 / 最寄り駅",
      "admin.form.price": "価格 (例: 49€または無料)",
      "admin.form.bookingUrl": "予約リンク (任意)",
      "admin.form.longDescription": "詳細紹介 (段落ごとに改行)",
      "admin.form.tips": "ヒント (1行に1つ)",
      "admin.form.korean": "韓国語フレーズ",
      "admin.form.transliteration": "発音表記",
      "admin.form.french": "仏語訳",
      "admin.form.culturalNote": "カルチャーメモ (任意)",
      "auth.badge": "セキュアアクセス",
      "auth.title": "Decorée ログイン",
      "auth.subtitle":
        "ログインしてお気に入りを保存。スタジオは運営チーム向けです。",
      "auth.email": "メールアドレス",
      "auth.password": "パスワード",
      "auth.submit": "ログイン",
      "auth.loggingIn": "ログイン中…",
      "auth.error.unauthorisedEmail": "許可されていない管理者メールです。チームへ連絡してください。",
      "auth.footer.hint": "アカウントはFirebaseで管理されています。紛失時は運営へご連絡ください。",
      "auth.footer.support": "サポート: hello@decoree.app",
      "auth.loading": "セキュア領域を読み込み中…",
      "auth.firebaseError": "Firebase設定が見つからず管理ページを表示できません。",
      "auth.loginWithGoogle": "Googleで続行",
      "auth.googleLoading": "Googleログイン中…",
      "auth.or": "または",
      "auth.noAccount": "まだアカウントがありませんか？",
      "auth.goToSignup": "アカウント作成",
      "auth.haveAccount": "すでにアカウントがありますか？",
      "auth.goToLogin": "ログイン",
      "auth.signupTitle": "Decoréeアカウントを作成",
      "auth.signupSubtitle":
        "お気に入りを整理するDecoréeアカウントを作成。スタジオ権限は運営チームへお問い合わせください。",
      "auth.passwordConfirm": "パスワード確認",
      "auth.createAccount": "アカウント作成",
      "auth.signingUp": "登録処理中…",
      "auth.error.invalidCredential": "メールまたはパスワードが正しくありません。",
      "auth.error.weakPassword": "6文字以上のパスワードを設定してください。",
      "auth.error.emailExists": "既に登録済みのメールです。",
      "auth.error.passwordMismatch": "パスワードが一致しません。",
      "auth.adminOnlyTitle": "管理者権限が必要です",
      "auth.adminOnlyDescription":
        "このページは指定された管理者のみアクセスできます。権限が必要な場合はDecorée運営へお問い合わせください。",
      "auth.adminOnlyCta": "ホームに戻る",
      "trendDetail.notFound": "トレンドを見つけられませんでした",
      "trendDetail.notFoundSubtitle": "リンクが無効になったか移動された可能性があります。",
      "trendDetail.goBack": "戻る",
      "trendDetail.back": "戻る",
      "trendDetail.sidebarTitle": "ポイント",
      "trendDetail.neighborhood": "エリア",
      "trendDetail.intensity": "雰囲気",
      "trendDetail.intensity.highlight": "絶対行きたいスポット",
      "trendDetail.intensity.insider": "ローカル推薦",
      "trendDetail.intensity.emerging": "注目上昇中",
      "trendDetail.published": "公開日",
      "trendDetail.backToList": "トレンド一覧へ",
      "trendDetail.subscribeCta": "フルレポートを見る",
      "trendDetail.lockedTitle": "プレミアム限定",
      "trendDetail.lockedSubtitle": "Decoréeプレミアムで閲覧できます。",
      "trendDetail.unlockButton": "プレミアムを有効化",
      "eventDetail.notFound": "イベントが見つかりませんでした",
      "eventDetail.notFoundSubtitle": "削除されたか日程が変更された可能性があります。",
      "eventDetail.goBack": "戻る",
      "eventDetail.back": "戻る",
      "eventDetail.tipsTitle": "参加前のヒント",
      "eventDetail.infoTitle": "基本情報",
      "eventDetail.when": "日時",
      "eventDetail.where": "場所",
      "eventDetail.price": "料金",
      "eventDetail.bookingCta": "予約へ進む",
      "eventDetail.backToList": "他のイベントを見る",
      "eventDetail.discoverTrends": "トレンドレポートを探す",
      "japaneseLanding.badge": "Decorée for Japan",
      "japaneseLanding.hero.title": "Decoréeへようこそ、韓国カルチャーを日本語で",
      "japaneseLanding.hero.subtitle":
        "ソウルを中心にKカルチャーを追いかけるDecoréeが、日本語ユーザー向けに最新情報と旅行サポートをまとめました。",
      "japaneseLanding.hero.primary": "日本語で利用を開始",
      "japaneseLanding.hero.secondary": "フランス語版を見る",
      "japaneseLanding.overview.title": "Decoréeができること",
      "japaneseLanding.overview.items.trend.title": "週間トレンドレポート",
      "japaneseLanding.overview.items.trend.description":
        "現地で話題のポップアップ、カルチャー、街のムードを日本語で要約。旅の参考に。",
      "japaneseLanding.overview.items.event.title": "Kカルチャーイベント検索",
      "japaneseLanding.overview.items.event.description":
        "ライブやフェス、伝統公演まで、日程・エリア別に探せます。",
      "japaneseLanding.overview.items.phrase.title": "旅×カルチャー韓国語",
      "japaneseLanding.overview.items.phrase.description":
        "シーン別フレーズとカルチャーメモを日本語＋ハングル＋発音でセット。",
      "japaneseLanding.cta.title": "Decoréeと一緒に韓国をもっと身近に",
      "japaneseLanding.cta.subtitle":
        "トレンド好き、日本文化と韓国カルチャーの橋渡しを目指す皆さんをサポートします。",
      "japaneseLanding.cta.button": "最新トレンドを読む",
      "japaneseLanding.resources.title": "次の一歩",
      "japaneseLanding.resources.items.cultureTest":
        "韓国カルチャーテストで自分の旅タイプを診断。",
      "japaneseLanding.resources.items.phrasebook":
        "フレーズ帳でシーン別の韓国語をチェック。",
      "japaneseLanding.resources.items.events":
        "イベントカレンダーで渡航時期のKカルチャーを確認。"
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
