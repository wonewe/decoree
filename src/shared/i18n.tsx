import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export type SupportedLanguage = "fr" | "ko" | "ja" | "en";

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
      "nav.popups": "Pop-up Radar",
      "nav.localSupport": "Support local",
      "nav.phrasebook": "Phrasebook personnalisé",
      "nav.cultureTest": "Test culture Corée",
      "nav.explore": "Explorer",
      "nav.admin": "Studio koraid",
      "localSupport.services.title": "Guide des services publics",
      "localSupport.services.subtitle":
        "Démarches clés (enregistrement étranger, assurance santé, opérateurs) expliquées en français avec calendrier des échéances.",
      "localSupport.apps.title": "Tutoriels d'apps coréennes",
      "localSupport.apps.subtitle":
        "Mode d'emploi pour Naver Map, Baemin, Coupang et plus avec captures et astuces.",
      "localSupport.community.title": "Communauté étudiants & expats",
      "localSupport.community.subtitle":
        "Forums par université/ville pour Q&A, retours d'expérience et meetups.",
      "auth.login": "Connexion",
      "auth.logout": "Déconnexion",
      "auth.signup": "Créer un compte",
      "hero.title": "Découvrir la Corée sans barrières",
      "hero.subtitle":
        "Décodage des tendances, événements K-culture et phrasebook personnalisé, conçus pour les voyageurs francophones.",
      "hero.cta.primary": "Explorer les tendances",
      "hero.cta.secondary": "Voir les nouveautés",
      "hero.highlights.title": "koraid en un clin d'œil",
      "hero.highlights.cta": "Découvrir",
      "hero.highlights.trends.title": "Trend Decoder",
      "hero.highlights.trends.description": "Consultez notre analyse hebdomadaire en français.",
      "hero.highlights.events.title": "Calendrier K-Culture",
      "hero.highlights.events.description": "Planifiez concerts, festivals et pop-ups selon vos dates.",
      "hero.highlights.phrasebook.title": "Phrasebook personnalisé",
      "hero.highlights.phrasebook.description":
        "Retrouvez des expressions clés avec audio et notes culturelles.",
      "hero.highlights.popups.title": "Radar pop-ups",
      "hero.highlights.popups.description":
        "Parcours créateurs, cafés concept et collaborations limitées.",
      "hero.ribbon": "koraid MVP",
      "hero.card.title": "Weekly Trend Decoder",
      "hero.card.subtitle": "Pop-up Han River Sunset Market",
      "hero.card.caption": "Firebase, Google Maps — prêts pour l'intégration finale.",
      "hero.spotlight.title": "Sélection koraid",
      "hero.spotlight.tag.trend": "Trend Decoder",
      "hero.spotlight.tag.event": "Event Calendar",
      "hero.spotlight.tag.phrase": "Phrasebook",
      "hero.spotlight.cta.trend": "Lire la tendance complète",
      "hero.spotlight.cta.event": "Réserver sa place",
      "hero.spotlight.cta.phrase": "Apprendre l'expression",
      "hero.spotlight.disclaimer": "Sélection éditoriale par koraid.",
      "popupRadar.title": "Radar Seongsu Pop-up",
      "popupRadar.subtitle":
        "Plan de route en trois temps pour suivre les collaborations mode/design et cafés éphémères du quartier.",
      "popupRadar.sections.overview.title": "Pourquoi Seongsu ?",
      "popupRadar.sections.overview.body":
        "Anciennes usines transformées en ateliers créatifs, pop-ups de sneakers, roasteries de quartier… Seongsu concentre les lancements les plus rapides de Séoul.",
      "popupRadar.sections.timeline.title": "Parcours du jour",
      "popupRadar.sections.timeline.note": "Les horaires changent chaque semaine : vérifiez les stories Insta des marques listées.",
      "popupRadar.sections.timeline.items.morning.title": "Matin – cafés & collabs",
      "popupRadar.sections.timeline.items.morning.body":
        "Commencez chez Layered Seongsu pour les desserts, puis filez chez Ader Error Factory pour les sorties capsules (ouvert 11h).",
      "popupRadar.sections.timeline.items.afternoon.title": "Après-midi – studios & ateliers",
      "popupRadar.sections.timeline.items.afternoon.body":
        "Visitez Stand Oil Archive, puis participez à un atelier sérigraphie chez Open Studio (réservation via Kakao).",
      "popupRadar.sections.timeline.items.evening.title": "Soir – rooftop & marché",
      "popupRadar.sections.timeline.items.evening.body":
        "Terminez à OR.EO rooftop pour les cocktails sans alcool avant de faire un tour au marché nocturne Common Ground.",
      "popupRadar.sections.tips.title": "Tips rapides",
      "popupRadar.sections.tips.items.1": "Gardez une carte T-money chargée : beaucoup de pop-ups demandent un paiement sans cash.",
      "popupRadar.sections.tips.items.2": "Les files ouvrent ~30 min avant les drops. Arrivez tôt avec un numéro de passage.",
      "popupRadar.sections.tips.items.3": "Regroupez les achats : la plupart des boutiques proposent une consigne pour vos sacs.",
      "popupRadar.sections.now.title": "Pop-ups en cours",
      "popupRadar.sections.now.subtitle": "Sélection mise à jour chaque semaine. Les horaires peuvent varier.",
      "popupRadar.search.label": "Rechercher un pop-up",
      "popupRadar.search.placeholder": "Tapez une marque, un quartier, un tag…",
      "popupRadar.search.clear": "Effacer",
      "popupRadar.empty": "Aucun pop-up ne correspond à vos filtres.",
      "popupRadar.filters.all": "Tous",
      "popupRadar.filters.now": "En cours",
      "popupRadar.filters.soon": "Bientôt",
      "popupRadar.status.now": "En cours",
      "popupRadar.status.soon": "Bientôt",
      "popupRadar.cards.cta": "Voir les détails",
      "popupRadar.cards.1.name": "Paperhood x Muzikt Studio",
      "popupRadar.cards.1.window": "Jusqu'au 24 juin • 11h-20h",
      "popupRadar.cards.1.location": "Layered Seongsu 2F",
      "popupRadar.cards.1.description":
        "Capsule eyewear + set dessert limité inspiré du quartier. Les 30 premiers visiteurs reçoivent un tote sérigraphié.",
      "popupRadar.cards.1.tags": "capsule,food pairing,limited",
      "popupRadar.cards.2.name": "Stand Oil Archive Market",
      "popupRadar.cards.2.window": "20-28 juin • 12h-21h",
      "popupRadar.cards.2.location": "Stand Oil Archive, Buldang-ro 8",
      "popupRadar.cards.2.description":
        "Atelier de personnalisation de sacs + upcycling corner avec designers invités. Session carte postale à 15h.",
      "popupRadar.cards.2.tags": "design,atelier,upcycling",
      "popupRadar.cards.3.name": "OR.EO Rooftop Listening Bar",
      "popupRadar.cards.3.window": "Chaque soir • 18h-23h",
      "popupRadar.cards.3.location": "OR.EO Rooftop, Seongsu-ro 7",
      "popupRadar.cards.3.description":
        "Bar éphémère signé par des mixologues non alcool, playlists live de DJ locaux, réservations via Instagram DM.",
      "popupRadar.cards.3.tags": "night,playlist,zero-proof",
      "popupRadar.cta.map": "Ouvrir la carte Seongsu",
      "popupRadar.cta.trends": "Lire les autres tendances",
      "trends.title": "Weekly Trend Decoder",
      "trends.subtitle": "Analyses hebdomadaires des tendances coréennes, en français.",
      "trends.empty": "Aucun Trend Decoder n'est disponible pour le moment. Revenez très vite.",
      "trends.error": "Impossible de charger le Trend Decoder.",
      "trends.sample": "Voir un extrait gratuit",
      "trends.readMore": "Lire le reportage",
      "trends.viewAll": "Voir toutes les tendances",
      "trends.byline": "Par {author}",
      "events.title": "K-Culture Event Calendar",
      "events.subtitle":
        "Filtrer les concerts, festivals et pop-ups selon vos dates et envies.",
      "events.filter.label": "Filtrer par type",
      "events.filter.all": "Tous",
      "events.dateFilter.title": "Filtrer par dates",
      "events.dateFilter.start": "Date de début",
      "events.dateFilter.end": "Date de fin",
      "events.dateFilter.reset": "Réinitialiser",
      "events.empty": "Aucun événement ne correspond à vos critères pour le moment.",
      "events.error": "Impossible de charger les événements pour le moment.",
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
      "phrasebook.empty": "Aucune expression n'est disponible pour l'instant.",
      "phrasebook.error": "Impossible de charger votre phrasebook personnalisé.",
      "phrasebook.search.label": "Rechercher une expression",
      "phrasebook.search.placeholder": "Rechercher: dessert, shopping, 감사합니다…",
      "phrasebook.search.clear": "Effacer",
      "phrasebook.search.empty": "Aucune expression ne correspond à votre recherche pour l’instant.",
      "cultureTest.badge": "Quiz K-Culture",
      "cultureTest.title": "Quel voyageur de Corée êtes-vous ?",
      "cultureTest.subtitle":
        "Répondez à 5 questions et obtenez un profil koraid avec des idées de tendances, d’événements et d’expressions à tester sur place.",
      "cultureTest.progress.complete": "Résultat personnalisé prêt !",
      "cultureTest.progress.step": "Question {current}/{total}",
      "cultureTest.progress.helper": "Une seule réponse par question, suivez votre intuition.",
      "cultureTest.actions.previous": "Précédent",
      "cultureTest.actions.reset": "Réinitialiser",
      "cultureTest.actions.submit": "Voir mon résultat",
      "cultureTest.actions.next": "Suivant",
      "cultureTest.actions.share": "Partager mon profil",
      "cultureTest.actions.retry": "Recommencer",
      "cultureTest.share.title": "Quiz koraid",
      "cultureTest.share.text": "Mon profil koraid : {result}. Et toi, quel voyageur de Corée es-tu ?",
      "cultureTest.share.copied": "Lien copié !",
      "cultureTest.share.error": "Impossible de partager pour le moment.",
      "cultureTest.hint.title": "Comment fonctionne le test ?",
      "cultureTest.hint.subtitle":
        "Chaque réponse alimente les quatre profils voyageurs imaginés par koraid.",
      "cultureTest.hint.item.1": "Pas de bonne ou mauvaise réponse : écoutez votre vibe du moment.",
      "cultureTest.hint.item.2":
        "Les résultats mixent tendances, gastronomie, patrimoine et slow travel.",
      "cultureTest.hint.item.3":
        "Vous pouvez revenir en arrière ou recommencer complètement quand vous voulez.",
      "cultureTest.result.badge": "Votre profil koraid",
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
        "Consultez le Trend Decoder pour suivre les lancements collab en direct.",
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
      "footer.madeIn": "Conçu à Séoul pour les voyageurs français",
      "admin.title": "Studio koraid",
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
        "Complétez les champs puis cliquez sur “Enregistrer”. La tendance sera visible immédiatement pour les utilisateurs connectés.",
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
      "admin.form.saving": "Enregistrement…",
      "admin.form.location": "Adresse / Station proche",
      "admin.form.price": "Tarif (ex: 49€ ou Entrée libre)",
      "admin.form.bookingUrl": "Lien de réservation (optionnel)",
      "admin.form.longDescription": "Description longue (séparez par un saut de ligne)",
      "admin.form.tips": "Conseils pratiques (1 par ligne)",
      "admin.form.korean": "Expression en coréen",
      "admin.form.transliteration": "Prononciation (translittération)",
      "admin.form.language": "Langue",
      "admin.form.author": "Auteur",
      "admin.form.translation": "Traduction (selon la langue)",
      "admin.form.culturalNote": "Note culturelle (optionnelle)",
      "auth.badge": "Accès sécurisé",
      "auth.title": "Connexion au compte koraid",
      "auth.subtitle":
        "Connectez-vous pour retrouver vos favoris. Le Studio reste réservé à l'équipe koraid.",
      "auth.email": "Email professionnel",
      "auth.password": "Mot de passe",
      "auth.submit": "Se connecter",
      "auth.loggingIn": "Connexion…",
      "auth.error.unauthorisedEmail": "Cette adresse email n'est pas autorisée. Contactez l'équipe koraid.",
      "auth.footer.hint": "Les identifiants sont gérés par Firebase Authentication. Si vous les perdez, contactez l'administrateur.",
      "auth.footer.support": "Besoin d'aide ? Team@kor-aid.com",
      "auth.loading": "Chargement de l'espace sécurisé…",
      "auth.firebaseError": "Impossible d'afficher l'espace administrateur (configuration Firebase manquante).",
      "auth.loginWithGoogle": "Continuer avec Google",
      "auth.googleLoading": "Connexion Google…",
      "auth.or": "ou",
      "auth.noAccount": "Pas encore de compte ?",
      "auth.goToSignup": "Créer un accès",
      "auth.haveAccount": "Déjà enregistré ?",
      "auth.goToLogin": "Se connecter",
      "auth.signupTitle": "Créer un accès koraid",
      "auth.signupSubtitle":
        "Créez votre espace koraid. Pour le Studio, demandez un accès administrateur.",
      "auth.passwordConfirm": "Confirmez le mot de passe",
      "auth.createAccount": "Créer l'accès",
      "auth.signingUp": "Création du compte…",
      "auth.error.invalidCredential": "Identifiant ou mot de passe incorrect.",
      "auth.error.weakPassword": "Mot de passe trop faible (6 caractères minimum).",
      "auth.error.emailExists": "Un compte existe déjà avec cette adresse.",
      "auth.error.passwordMismatch": "Les deux mots de passe ne correspondent pas.",
      "auth.adminOnlyTitle": "Accès administrateur requis",
      "auth.adminOnlyDescription":
        "Cette section est réservée aux comptes approuvés. Contactez l'équipe koraid pour obtenir un accès Studio.",
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
      "trendDetail.author.label": "Rédigé par",
      "trendDetail.backToList": "Retour aux tendances",
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
      "profile.badge": "Mon espace koraid",
      "profile.title": "Votre profil koraid",
      "profile.subtitle":
        "Mettez à jour votre nom d'affichage et consultez les détails de votre compte sécurisé.",
      "profile.section.identity": "Identité",
      "profile.section.identityHint":
        "Le nom saisi apparaît sur vos espaces personnels et communications koraid.",
      "profile.form.displayName": "Nom à afficher",
      "profile.form.displayNamePlaceholder": "Ex. Claire Dupont",
      "profile.form.email": "Email de connexion",
      "profile.actions.save": "Enregistrer les modifications",
      "profile.actions.saving": "Enregistrement…",
      "profile.actions.logout": "Se déconnecter",
      "profile.feedback.success": "Profil mis à jour !",
      "profile.errors.displayNameRequired": "Merci d'indiquer un nom à afficher.",
      "profile.errors.generic": "Impossible de mettre à jour votre profil pour le moment.",
      "profile.section.account": "Informations compte",
      "profile.section.accountHint":
        "Les métadonnées proviennent de Firebase et sécurisent votre accès koraid.",
      "profile.account.displayName": "Nom affiché",
      "profile.account.fallbackName": "Nom non défini",
      "profile.account.email": "Email",
      "profile.account.created": "Compte créé le",
      "profile.account.lastLogin": "Dernière connexion",
      "profile.account.uid": "Identifiant utilisateur",
      "profile.noUser.title": "Aucun profil disponible",
      "profile.noUser.subtitle": "Connectez-vous pour accéder à votre page personnelle.",
      "profile.bookmarks.title": "Mes favoris",
      "profile.bookmarks.subtitle":
        "Retrouvez ici les tendances, événements et pop-ups que vous avez enregistrés.",
      "profile.bookmarks.empty":
        "Aucun favori pour le moment. Ajoutez-en depuis les cartes koraid.",
      "bookmarks.button.save": "Ajouter aux favoris",
      "bookmarks.button.remove": "Retirer des favoris",
      "bookmarks.actions.view": "Ouvrir",
      "bookmarks.actions.remove": "Supprimer",
      "bookmarks.type.trend": "Trend Decoder",
      "bookmarks.type.event": "Événement",
      "bookmarks.type.popup": "Pop-up radar",
      "japaneseLanding.badge": "koraid pour le Japon",
      "japaneseLanding.hero.title": "Bienvenue sur koraid, la K-culture en japonais",
      "japaneseLanding.hero.subtitle":
        "Basée à Séoul, l'équipe koraid rassemble pour le public japonais les tendances, événements et conseils essentiels.",
      "japaneseLanding.hero.primary": "Accéder à la version japonaise",
      "japaneseLanding.hero.secondary": "Voir la version française",
      "japaneseLanding.overview.title": "Ce que propose koraid",
      "japaneseLanding.overview.items.trend.title": "Trend Decoder hebdo",
      "japaneseLanding.overview.items.trend.description":
        "Pop-up, collaborations K-culture, ambiance quartier : un digest en japonais pour préparer votre voyage.",
      "japaneseLanding.overview.items.event.title": "Calendrier K-culture",
      "japaneseLanding.overview.items.event.description":
        "Concerts, festivals et spectacles traditionnels filtrés par dates et quartiers.",
      "japaneseLanding.overview.items.phrase.title": "Phrasebook voyage & culture",
      "japaneseLanding.overview.items.phrase.description":
        "Expressions clés avec prononciation et notes culturelles disponibles en japonais.",
      "japaneseLanding.cta.title": "Découvrez la Corée avec koraid",
      "japaneseLanding.cta.subtitle":
        "Nous accompagnons les voyageurs japonais passionnés de tendances et de patrimoine coréen.",
      "japaneseLanding.cta.button": "Lire les tendances récentes",
      "japaneseLanding.resources.title": "Et ensuite ?",
      "japaneseLanding.resources.items.cultureTest":
        "Essayez notre test culture pour connaître votre profil koraid.",
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
      "nav.popups": "팝업 레이더",
      "nav.localSupport": "로컬 지원",
      "nav.phrasebook": "맞춤형 회화",
      "nav.cultureTest": "한국 문화 테스트",
      "nav.explore": "콘텐츠 탐색",
      "nav.admin": "koraid 스튜디오",
      "localSupport.services.title": "공공 서비스 가이드",
      "localSupport.services.subtitle":
        "외국인등록, 건강보험, 통신사 가입 등 필수 행정 절차를 프랑스어 설명과 일정 캘린더로 제공합니다.",
      "localSupport.apps.title": "한국 앱 튜토리얼 허브",
      "localSupport.apps.subtitle":
        "네이버지도, 배달의민족, 쿠팡 등 주요 앱 사용법을 프랑스어 캡처와 함께 안내합니다.",
      "localSupport.community.title": "유학생 커뮤니티",
      "localSupport.community.subtitle":
        "학교·도시별 게시판에서 Q&A, 후기를 공유하고 모임을 찾을 수 있습니다.",
      "auth.login": "로그인",
      "auth.logout": "로그아웃",
      "auth.signup": "회원가입",
      "hero.title": "트렌드를 찾아보세요",
      "hero.subtitle":
        "다양한 트렌드를 koraid 에서 찾아보세요",
      "hero.cta.primary": "트렌드 확인하기",
      "hero.cta.secondary": "새소식 보기",
      "hero.highlights.title": "koraid 한눈에 보기",
      "hero.highlights.cta": "자세히 보기",
      "hero.highlights.trends.title": "트렌드 리포트",
      "hero.highlights.trends.description": "프랑스어로 정리된 주간 인사이트.",
      "hero.highlights.events.title": "K-컬처 캘린더",
      "hero.highlights.events.description": "공연·페스티벌 일정을 한 번에 확인하세요.",
      "hero.highlights.phrasebook.title": "맞춤형 회화장",
      "hero.highlights.phrasebook.description": "상황별 표현과 문화 팁을 저장해 두세요.",
      "hero.highlights.popups.title": "팝업 레이더",
      "hero.highlights.popups.description": "크리에이터 협업과 카페 투어를 한 번에.",
      "hero.ribbon": "koraid MVP",
      "hero.card.title": "Weekly Trend Decoder",
      "hero.card.subtitle": "한강 선셋 마켓 팝업",
      "hero.card.caption": "Firebase · Google Maps 연동 준비 완료",
      "hero.spotlight.title": "koraid 추천",
      "hero.spotlight.tag.trend": "트렌드 리포트",
      "hero.spotlight.tag.event": "이벤트 캘린더",
      "hero.spotlight.tag.phrase": "맞춤형 회화",
      "hero.spotlight.cta.trend": "자세히 읽기",
      "hero.spotlight.cta.event": "지금 예약하기",
      "hero.spotlight.cta.phrase": "표현 익히기",
      "hero.spotlight.disclaimer": "koraid가 직접 큐레이션한 추천입니다.",
      "popupRadar.title": "성수 팝업 레이더",
      "popupRadar.subtitle": "크리에이터 협업, 한정 컬렉션, 팝업 카페를 한 번에 체크하는 1일 코스.",
      "popupRadar.sections.overview.title": "왜 성수인가요?",
      "popupRadar.sections.overview.body":
        "공장지대가 스튜디오와 편집숍으로 변신한 성수는 한정판 드롭과 팝업이 가장 먼저 열리는 지역입니다.",
      "popupRadar.sections.timeline.title": "추천 타임라인",
      "popupRadar.sections.timeline.note": "브랜드별 운영 시간이 자주 바뀌니 인스타 스토리를 꼭 확인하세요.",
      "popupRadar.sections.timeline.items.morning.title": "AM – 카페 & 드롭 체크",
      "popupRadar.sections.timeline.items.morning.body":
        "레이어드 성수에서 디저트로 시작하고, 11시에 오픈하는 아더에러 팩토리에서 최신 캡슐을 둘러보세요.",
      "popupRadar.sections.timeline.items.afternoon.title": "PM – 스튜디오 & 클래스",
      "popupRadar.sections.timeline.items.afternoon.body":
        "스탠드오일 아카이브를 방문한 뒤 Open Studio 실크스크린 클래스(카카오 예약)를 체험하세요.",
      "popupRadar.sections.timeline.items.evening.title": "EVENING – 루프탑 & 마켓",
      "popupRadar.sections.timeline.items.evening.body":
        "OR.EO 루프탑에서 논알코올 칵테일을 즐기고, 커먼그라운드 야시장으로 마무리하세요.",
      "popupRadar.sections.tips.title": "빠른 팁",
      "popupRadar.sections.tips.items.1": "T-money 카드 잔액을 충분히 충전해 두면 대부분의 팝업에서 바로 결제 가능합니다.",
      "popupRadar.sections.tips.items.2": "드롭 대기줄은 오픈 30분 전에 시작합니다. 번호표를 받은 뒤 주변 카페에서 기다리세요.",
      "popupRadar.sections.tips.items.3": "쇼핑 백은 편집숍 보관 서비스를 활용하면 이동이 편합니다.",
      "popupRadar.sections.now.title": "이번 주 오픈 팝업",
      "popupRadar.sections.now.subtitle": "주간으로 업데이트됩니다. 운영 시간이 수시로 변동될 수 있어요.",
      "popupRadar.search.label": "팝업 검색",
      "popupRadar.search.placeholder": "브랜드, 동네, 태그를 입력하세요",
      "popupRadar.search.clear": "지우기",
      "popupRadar.empty": "조건에 맞는 팝업이 없습니다.",
      "popupRadar.filters.all": "전체",
      "popupRadar.filters.now": "진행 중",
      "popupRadar.filters.soon": "오픈 예정",
      "popupRadar.status.now": "진행 중",
      "popupRadar.status.soon": "오픈 예정",
      "popupRadar.cards.cta": "자세히 보기",
      "popupRadar.cards.1.name": "Paperhood x Muzikt 스튜디오",
      "popupRadar.cards.1.window": "6월 24일까지 • 11:00-20:00",
      "popupRadar.cards.1.location": "레이어드 성수 2층",
      "popupRadar.cards.1.description":
        "아이웨어 캡슐과 한정 디저트를 동시 출시. 선착순 30명에게 실크스크린 토트 증정.",
      "popupRadar.cards.1.tags": "캡슐,디저트,리미티드",
      "popupRadar.cards.2.name": "Stand Oil Archive Market",
      "popupRadar.cards.2.window": "6월 20-28일 • 12:00-21:00",
      "popupRadar.cards.2.location": "성수구 뚝섬로 8길 Stand Oil",
      "popupRadar.cards.2.description":
        "가방 커스터마이징과 업사이클 코너, 15시에 포스트카드 스탬프 세션.",
      "popupRadar.cards.2.tags": "디자인,워크샵,업사이클",
      "popupRadar.cards.3.name": "OR.EO 루프탑 리스닝바",
      "popupRadar.cards.3.window": "매일 저녁 • 18:00-23:00",
      "popupRadar.cards.3.location": "성수로 7 OR.EO 루프탑",
      "popupRadar.cards.3.description":
        "논알콜 칵테일 바 + 로컬 DJ 플레이리스트. 인스타 DM으로 예약.",
      "popupRadar.cards.3.tags": "루프탑,플레이리스트,제로프루프",
      "popupRadar.cta.map": "성수 지도 열기",
      "popupRadar.cta.trends": "다른 트렌드 보기",
      "trends.title": "주간 트렌드 해독 리포트",
      "trends.subtitle": "프랑스 여행자를 위한 심층 소비 트렌드 분석.",
      "trends.empty": "현재 공개된 트렌드 리포트가 없습니다. 곧 새로운 소식을 전해 드릴게요.",
      "trends.error": "트렌드 리포트를 불러오지 못했습니다.",
      "trends.sample": "무료 미리보기",
      "trends.readMore": "자세히 보기",
      "trends.viewAll": "모든 트렌드 보기",
      "trends.byline": "{author} 작성",
      "events.title": "K-컬처 이벤트 캘린더",
      "events.subtitle": "여행 일정에 맞는 공연, 축제, 팝업을 검색하세요.",
      "events.filter.label": "유형 선택",
      "events.filter.all": "전체",
      "events.dateFilter.title": "날짜 범위",
      "events.dateFilter.start": "시작 날짜",
      "events.dateFilter.end": "종료 날짜",
      "events.dateFilter.reset": "초기화",
      "events.empty": "조건에 맞는 이벤트가 없습니다.",
      "events.error": "이벤트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
      "phrasebook.empty": "아직 등록된 표현이 없습니다. 곧 업데이트할게요.",
      "phrasebook.error": "맞춤형 회화장을 불러오지 못했습니다.",
      "phrasebook.search.label": "표현 검색",
      "phrasebook.search.placeholder": "예: 디저트, 쇼핑, 감사합니다…",
      "phrasebook.search.clear": "지우기",
      "phrasebook.search.empty": "조건에 맞는 표현이 없습니다. 다른 키워드로 검색해 보세요.",
      "cultureTest.badge": "K-컬처 MBTI",
      "cultureTest.title": "당신은 어떤 한국 여행자일까요?",
      "cultureTest.subtitle":
        "5개의 질문으로 나만의 여행 페르소나를 찾아보세요. koraid에서 바로 즐길 수 있는 맞춤 추천을 보여드릴게요.",
      "cultureTest.progress.complete": "맞춤 추천이 준비됐어요!",
      "cultureTest.progress.step": "{current}/{total}번 질문",
      "cultureTest.progress.helper": "한 가지를 골라 직감을 믿어보세요.",
      "cultureTest.actions.previous": "이전",
      "cultureTest.actions.reset": "전체 초기화",
      "cultureTest.actions.submit": "결과 보기",
      "cultureTest.actions.next": "다음",
      "cultureTest.actions.share": "결과 공유하기",
      "cultureTest.actions.retry": "다시 테스트하기",
      "cultureTest.share.title": "koraid 여행 페르소나",
      "cultureTest.share.text": "koraid 테스트 결과: {result}. 당신의 한국 여행 페르소나는 무엇인가요?",
      "cultureTest.share.copied": "링크가 복사되었습니다!",
      "cultureTest.share.error": "공유에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      "cultureTest.hint.title": "테스트 이용 방법",
      "cultureTest.hint.subtitle": "각 답변은 koraid가 정리한 네 가지 여행 성향 데이터와 연결됩니다.",
      "cultureTest.hint.item.1": "정답은 없어요. 지금 끌리는 장면을 고르세요.",
      "cultureTest.hint.item.2": "트렌드, 미식, 힐링, 헤리티지를 입체적으로 분석해 드려요.",
      "cultureTest.hint.item.3": "언제든지 이전으로 돌아가거나 전체를 초기화할 수 있어요.",
      "cultureTest.result.badge": "나의 koraid 페르소나",
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
        "Trend Decoder 업데이트를 매주 확인해 가장 빠른 런칭을 캐치하세요.",
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
      "footer.madeIn": "서울에서 제작",
      "admin.title": "koraid 콘텐츠 스튜디오",
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
      "admin.form.saving": "저장 중…",
      "admin.form.location": "위치 / 인근 역",
      "admin.form.price": "가격 (예: 49€ 또는 무료)",
      "admin.form.bookingUrl": "예약 링크 (선택)",
      "admin.form.longDescription": "상세 소개 (문단마다 한 줄 띄우기)",
      "admin.form.tips": "꿀팁 (한 줄에 하나씩)",
      "admin.form.korean": "한국어 표현",
      "admin.form.transliteration": "발음 표기",
      "admin.form.language": "언어",
      "admin.form.author": "저자",
      "admin.form.translation": "번역 (선택 언어)",
      "admin.form.culturalNote": "문화 팁 (선택)",
      "auth.badge": "보안 전용",
      "auth.title": "koraid 로그인",
      "auth.subtitle":
        "로그인하여 관심 콘텐츠를 저장하세요. 스튜디오는 운영진만 접근할 수 있습니다.",
      "auth.email": "이메일",
      "auth.password": "비밀번호",
      "auth.submit": "로그인",
      "auth.loggingIn": "로그인 중…",
      "auth.error.unauthorisedEmail": "허용된 관리자 이메일이 아닙니다. 팀에 문의하세요.",
      "auth.footer.hint": "이 계정은 Firebase Authentication으로 관리됩니다. 분실 시 운영팀에 요청하세요.",
      "auth.footer.support": "지원: archaimbaud08@gmail.com",
      "auth.loading": "보안 영역을 불러오는 중입니다…",
      "auth.firebaseError": "Firebase 설정을 찾을 수 없어 관리자 페이지를 표시할 수 없습니다.",
      "auth.loginWithGoogle": "Google 계정으로 계속",
      "auth.googleLoading": "Google 로그인 중…",
      "auth.or": "또는",
      "auth.noAccount": "아직 계정이 없나요?",
      "auth.goToSignup": "계정 만들기",
      "auth.haveAccount": "이미 계정이 있나요?",
      "auth.goToLogin": "로그인",
      "auth.signupTitle": "koraid 계정 만들기",
      "auth.signupSubtitle":
        "koraid 계정을 만들고 관심 콘텐츠를 모아보세요. 스튜디오 권한은 운영진에게 문의하세요.",
      "auth.passwordConfirm": "비밀번호 확인",
      "auth.createAccount": "계정 생성",
      "auth.signingUp": "가입 처리 중…",
      "auth.error.invalidCredential": "이메일 또는 비밀번호가 올바르지 않습니다.",
      "auth.error.weakPassword": "비밀번호를 6자 이상으로 설정하세요.",
      "auth.error.emailExists": "이미 등록된 이메일입니다.",
      "auth.error.passwordMismatch": "비밀번호가 서로 다릅니다.",
      "auth.adminOnlyTitle": "관리자 권한이 필요합니다",
      "auth.adminOnlyDescription":
        "이 페이지는 지정된 관리자만 볼 수 있습니다. 권한이 필요하다면 koraid 운영팀에 문의해 주세요.",
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
      "trendDetail.author.label": "작성자",
      "trendDetail.backToList": "트렌드 목록으로",
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
      "profile.badge": "koraid 마이페이지",
      "profile.title": "내 프로필 관리",
      "profile.subtitle": "표시 이름을 수정하고 koraid 계정 정보를 확인하세요.",
      "profile.section.identity": "기본 정보",
      "profile.section.identityHint": "입력한 이름은 마이페이지와 맞춤 이메일에 표시됩니다.",
      "profile.form.displayName": "표시 이름",
      "profile.form.displayNamePlaceholder": "예: 윤서 Park",
      "profile.form.email": "로그인 이메일",
      "profile.actions.save": "정보 저장하기",
      "profile.actions.saving": "저장 중…",
      "profile.actions.logout": "로그아웃",
      "profile.feedback.success": "프로필이 업데이트되었습니다!",
      "profile.errors.displayNameRequired": "표시 이름을 입력해 주세요.",
      "profile.errors.generic": "프로필을 저장할 수 없습니다. 잠시 후 다시 시도해 주세요.",
      "profile.section.account": "계정 정보",
      "profile.section.accountHint": "Firebase 메타데이터는 계정 보안을 위해 사용됩니다.",
      "profile.account.displayName": "표시 이름",
      "profile.account.fallbackName": "설정되지 않음",
      "profile.account.email": "이메일",
      "profile.account.created": "계정 생성일",
      "profile.account.lastLogin": "최근 로그인",
      "profile.account.uid": "사용자 UID",
      "profile.noUser.title": "로그인이 필요합니다",
      "profile.noUser.subtitle": "koraid 계정으로 로그인하면 마이페이지를 사용할 수 있습니다.",
      "profile.bookmarks.title": "저장한 북마크",
      "profile.bookmarks.subtitle": "관심 있는 트렌드·이벤트·팝업을 한 곳에서 확인하세요.",
      "profile.bookmarks.empty":
        "아직 저장한 북마크가 없습니다. 카드의 북마크 버튼을 눌러 추가해보세요.",
      "bookmarks.button.save": "북마크 저장",
      "bookmarks.button.remove": "북마크 해제",
      "bookmarks.actions.view": "열어보기",
      "bookmarks.actions.remove": "삭제",
      "bookmarks.type.trend": "트렌드 리포트",
      "bookmarks.type.event": "이벤트",
      "bookmarks.type.popup": "팝업 레이더",
      "japaneseLanding.badge": "koraid for Japan",
      "japaneseLanding.hero.title": "일본 사용자를 위한 koraid에 오신 것을 환영합니다",
      "japaneseLanding.hero.subtitle":
        "서울 기반 koraid 팀이 일본 여행자를 위해 최신 트렌드와 이벤트, 여행 꿀팁을 일본어로 정리했습니다.",
      "japaneseLanding.hero.primary": "일본어 버전으로 보기",
      "japaneseLanding.hero.secondary": "프랑스어 버전 보기",
      "japaneseLanding.overview.title": "koraid가 드리는 서비스",
      "japaneseLanding.overview.items.trend.title": "주간 트렌드 리포트",
      "japaneseLanding.overview.items.trend.description":
        "현지에서 화제인 팝업과 협업, 동네 무드를 일본어로 요약해 드립니다.",
      "japaneseLanding.overview.items.event.title": "K-컬처 캘린더",
      "japaneseLanding.overview.items.event.description":
        "공연, 페스티벌, 전통 공연을 날짜와 지역별로 손쉽게 확인하세요.",
      "japaneseLanding.overview.items.phrase.title": "여행 & 문화 한국어",
      "japaneseLanding.overview.items.phrase.description":
        "상황별 표현과 문화 메모를 일본어·한글·발음과 함께 제공합니다.",
      "japaneseLanding.cta.title": "koraid와 함께 더 가까워지는 한국 여행",
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
      "nav.popups": "ポップアップレーダー",
      "nav.localSupport": "ローカルサポート",
      "nav.phrasebook": "パーソナル会話帳",
      "nav.cultureTest": "韓国カルチャーテスト",
      "nav.explore": "ディスカバー",
      "nav.admin": "koraidスタジオ",
      "localSupport.services.title": "公共サービスガイド",
      "localSupport.services.subtitle":
        "外国人登録、健康保険、通信プランなどを日本語で説明し、手続きカレンダーも提供します。",
      "localSupport.apps.title": "韓国アプリ・チュートリアル",
      "localSupport.apps.subtitle":
        "Naver Map、Baemin、Coupangなど主要アプリの使い方を日本語で解説。",
      "localSupport.community.title": "留学生コミュニティ",
      "localSupport.community.subtitle":
        "大学・都市別掲示板でQ&Aや体験談を共有し、交流をサポートします。",
      "auth.login": "ログイン",
      "auth.logout": "ログアウト",
      "auth.signup": "アカウント作成",
      "hero.title": "言葉の壁を越えて韓国を旅しよう",
      "hero.subtitle":
        "最新トレンド分析、Kカルチャーイベント、興味別の韓国語フレーズを日本語でお届けします。",
      "hero.cta.primary": "トレンドを確認する",
      "hero.cta.secondary": "新着情報を見る",
      "hero.highlights.title": "koraid一覧",
      "hero.highlights.cta": "もっと見る",
      "hero.highlights.trends.title": "トレンドレポート",
      "hero.highlights.trends.description": "日本語で読める週間トレンド分析。",
      "hero.highlights.events.title": "Kカルチャーカレンダー",
      "hero.highlights.events.description": "コンサートやポップアップをまとめてチェック。",
      "hero.highlights.phrasebook.title": "パーソナル会話帳",
      "hero.highlights.phrasebook.description": "シーン別フレーズとカルチャーメモを保存。",
      "hero.highlights.popups.title": "ポップアップレーダー",
      "hero.highlights.popups.description": "コラボ限定とカフェツアーをまとめて。",
      "hero.ribbon": "koraid MVP",
      "hero.card.title": "Weekly Trend Decoder",
      "hero.card.subtitle": "漢江サンセットマーケット ポップアップ",
      "hero.card.caption": "Firebase・Google Mapsの連携準備OK。",
      "hero.spotlight.title": "koraidおすすめ",
      "hero.spotlight.tag.trend": "トレンドレポート",
      "hero.spotlight.tag.event": "イベントカレンダー",
      "hero.spotlight.tag.phrase": "パーソナル会話帳",
      "hero.spotlight.cta.trend": "特集を読む",
      "hero.spotlight.cta.event": "席を予約する",
      "hero.spotlight.cta.phrase": "フレーズを学ぶ",
      "hero.spotlight.disclaimer": "koraid編集チームによるセレクトです。",
      "popupRadar.title": "聖水ポップアップレーダー",
      "popupRadar.subtitle": "クリエイターコラボや限定カフェを1日で巡るためのルートガイド。",
      "popupRadar.sections.overview.title": "なぜ聖水？",
      "popupRadar.sections.overview.body":
        "工場地帯から変身した聖水は、デザイナーズショップや限定ポップアップが最速で登場するエリアです。",
      "popupRadar.sections.timeline.title": "1日の流れ",
      "popupRadar.sections.timeline.note": "営業時間は週ごとに変わるので、ブランドのInstagram Storyもチェック！",
      "popupRadar.sections.timeline.items.morning.title": "午前 – カフェ＆ドロップ",
      "popupRadar.sections.timeline.items.morning.body":
        "Layered聖水でデザートを楽しみ、11時オープンのADER ERROR FACTORYで最新コラボを確認。",
      "popupRadar.sections.timeline.items.afternoon.title": "午後 – スタジオ＆ワークショップ",
      "popupRadar.sections.timeline.items.afternoon.body":
        "Stand Oil Archiveを訪れた後、Open Studioのシルクスクリーン体験（Kakao予約）へ。",
      "popupRadar.sections.timeline.items.evening.title": "夜 – ルーフトップ＆マーケット",
      "popupRadar.sections.timeline.items.evening.body":
        "OR.EO Rooftopでノンアルコールカクテルを味わい、Common Ground夜市で締めくくり。",
      "popupRadar.sections.tips.title": "ヒント",
      "popupRadar.sections.tips.items.1": "T-moneyをチャージしておくと、ほとんどのポップアップでスムーズに支払いできます。",
      "popupRadar.sections.tips.items.2": "ドロップ待機列は開店30分前に始まるので、カフェで待ちながら整理券を確認。",
      "popupRadar.sections.tips.items.3": "ショッピングバッグは店舗のクロークサービスを活用すると身軽に動けます。",
      "popupRadar.sections.now.title": "今開いているポップアップ",
      "popupRadar.sections.now.subtitle": "毎週更新。営業時間は変更の可能性があります。",
      "popupRadar.search.label": "ポップアップ検索",
      "popupRadar.search.placeholder": "ブランドやエリア、タグで検索",
      "popupRadar.search.clear": "クリア",
      "popupRadar.empty": "条件に合うポップアップがありません。",
      "popupRadar.filters.all": "すべて",
      "popupRadar.filters.now": "開催中",
      "popupRadar.filters.soon": "まもなく",
      "popupRadar.status.now": "開催中",
      "popupRadar.status.soon": "まもなく",
      "popupRadar.cards.cta": "詳細を見る",
      "popupRadar.cards.1.name": "Paperhood × Muzikt Studio",
      "popupRadar.cards.1.window": "6月24日まで • 11:00-20:00",
      "popupRadar.cards.1.location": "Layered聖水 2F",
      "popupRadar.cards.1.description":
        "アイウェアカプセルと限定デザートを同時リリース。先着30名にシルクスクリーントートをプレゼント。",
      "popupRadar.cards.1.tags": "カプセル,スイーツ,限定",
      "popupRadar.cards.2.name": "Stand Oil Archive Market",
      "popupRadar.cards.2.window": "6月20-28日 • 12:00-21:00",
      "popupRadar.cards.2.location": "聖水洞トゥクソム路8ギル Stand Oil",
      "popupRadar.cards.2.description":
        "バッグカスタムとアップサイクルコーナー、15時にはポストカードスタンプセッション。",
      "popupRadar.cards.2.tags": "デザイン,ワークショップ,アップサイクル",
      "popupRadar.cards.3.name": "OR.EO Rooftop Listening Bar",
      "popupRadar.cards.3.window": "毎晩 • 18:00-23:00",
      "popupRadar.cards.3.location": "聖水路7 OR.EO Rooftop",
      "popupRadar.cards.3.description":
        "ノンアルコールカクテルとローカルDJのプレイリスト。Instagram DMで予約。",
      "popupRadar.cards.3.tags": "ルーフトップ,プレイリスト,ノンアル",
      "popupRadar.cta.map": "聖水マップを開く",
      "popupRadar.cta.trends": "ほかのトレンドを見る",
      "trends.title": "週間トレンドレポート",
      "trends.subtitle": "日本人旅行者向けに、韓国の消費トレンドを深掘りします。",
      "trends.empty": "現在公開中のトレンドレポートはありません。少し後でもう一度チェックしてください。",
      "trends.error": "トレンドレポートを読み込めませんでした。",
      "trends.sample": "無料サンプルを見る",
      "trends.readMore": "レポートを読む",
      "trends.viewAll": "すべてのトレンドを見る",
      "trends.byline": "{author} が執筆",
      "events.title": "Kカルチャー イベントカレンダー",
      "events.subtitle": "旅の日程に合わせてコンサート、フェス、ポップアップを検索。",
      "events.filter.label": "タイプを選択",
      "events.filter.all": "すべて",
      "events.dateFilter.title": "日付フィルター",
      "events.dateFilter.start": "開始日",
      "events.dateFilter.end": "終了日",
      "events.dateFilter.reset": "リセット",
      "events.empty": "条件に合うイベントが見つかりません。",
      "events.error": "イベントを読み込めませんでした。時間をおいて再度お試しください。",
      "event.eventCategory.concert": "コンサート / K-Pop",
      "event.eventCategory.traditional": "伝統芸能",
      "event.eventCategory.pop-up": "ポップアップ / クラス",
      "event.eventCategory.festival": "フェスティバル",
      "eventDetail.readMore": "イベント詳細へ",
      "phrasebook.title": "パーソナル韓国語フレーズ帳",
      "phrasebook.subtitle": "興味のあるテーマを選んで、必須フレーズとカルチャーメモを学ぼう。",
      "phrasebook.category.food": "グルメ",
      "phrasebook.category.shopping": "ショッピング",
      "phrasebook.category.entertainment": "カルチャー・エンタメ",
      "phrasebook.completed": "学習済みフレーズ",
      "phrasebook.empty": "現在表示できるフレーズがありません。",
      "phrasebook.error": "会話帳を読み込めませんでした。",
      "phrasebook.search.label": "フレーズ検索",
      "phrasebook.search.placeholder": "例: デザート, 쇼핑, 감사합니다…",
      "phrasebook.search.clear": "クリア",
      "phrasebook.search.empty": "該当するフレーズが見つかりません。別のキーワードをお試しください。",
      "cultureTest.badge": "KカルチャーMBTI",
      "cultureTest.title": "あなたはどんな韓国旅行タイプ？",
      "cultureTest.subtitle":
        "5つの質問に答えるだけで、koraidが提案する旅行ペルソナとおすすめプランがわかります。",
      "cultureTest.progress.complete": "パーソナル診断の準備が整いました！",
      "cultureTest.progress.step": "質問 {current}/{total}",
      "cultureTest.progress.helper": "直感で1つを選んでください。",
      "cultureTest.actions.previous": "前へ",
      "cultureTest.actions.reset": "すべてリセット",
      "cultureTest.actions.submit": "結果を見る",
      "cultureTest.actions.next": "次へ",
      "cultureTest.actions.share": "結果をシェア",
      "cultureTest.actions.retry": "再テスト",
      "cultureTest.share.title": "koraid 旅行診断",
      "cultureTest.share.text": "私のkoraid診断結果: {result}。あなたはどのタイプ？",
      "cultureTest.share.copied": "リンクをコピーしました！",
      "cultureTest.share.error": "共有に失敗しました。少し待って再試行してください。",
      "cultureTest.hint.title": "テストのヒント",
      "cultureTest.hint.subtitle": "それぞれの回答が4つの旅行ペルソナに紐づきます。",
      "cultureTest.hint.item.1": "正解はありません。今の気分で選びましょう。",
      "cultureTest.hint.item.2": "トレンド・グルメ・ヒーリング・ヘリテージを総合的に分析します。",
      "cultureTest.hint.item.3": "いつでも戻る・リセットが可能です。",
      "cultureTest.result.badge": "あなたのkoraidペルソナ",
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
        "Trend Decoderの最新アップデートでローンチ情報をキャッチ。",
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
      "footer.madeIn": "日本人旅行者のためにソウルでデザイン",
      "admin.title": "koraid コンテンツスタジオ",
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
      "admin.form.saving": "保存中…",
      "admin.form.location": "住所 / 最寄り駅",
      "admin.form.price": "価格 (例: 49€または無料)",
      "admin.form.bookingUrl": "予約リンク (任意)",
      "admin.form.longDescription": "詳細紹介 (段落ごとに改行)",
      "admin.form.tips": "ヒント (1行に1つ)",
      "admin.form.korean": "韓国語フレーズ",
      "admin.form.transliteration": "発音表記",
      "admin.form.language": "言語",
      "admin.form.author": "執筆者",
      "admin.form.translation": "翻訳（選択した言語）",
      "admin.form.culturalNote": "カルチャーメモ (任意)",
      "auth.badge": "セキュアアクセス",
      "auth.title": "koraid ログイン",
      "auth.subtitle":
        "ログインしてお気に入りを保存。スタジオは運営チーム向けです。",
      "auth.email": "メールアドレス",
      "auth.password": "パスワード",
      "auth.submit": "ログイン",
      "auth.loggingIn": "ログイン中…",
      "auth.error.unauthorisedEmail": "許可されていない管理者メールです。チームへ連絡してください。",
      "auth.footer.hint": "アカウントはFirebaseで管理されています。紛失時は運営へご連絡ください。",
      "auth.footer.support": "サポート: Team@kor-aid.com",
      "auth.loading": "セキュア領域を読み込み中…",
      "auth.firebaseError": "Firebase設定が見つからず管理ページを表示できません。",
      "auth.loginWithGoogle": "Googleで続行",
      "auth.googleLoading": "Googleログイン中…",
      "auth.or": "または",
      "auth.noAccount": "まだアカウントがありませんか？",
      "auth.goToSignup": "アカウント作成",
      "auth.haveAccount": "すでにアカウントがありますか？",
      "auth.goToLogin": "ログイン",
      "auth.signupTitle": "koraidアカウントを作成",
      "auth.signupSubtitle":
        "お気に入りを整理するkoraidアカウントを作成。スタジオ権限は運営チームへお問い合わせください。",
      "auth.passwordConfirm": "パスワード確認",
      "auth.createAccount": "アカウント作成",
      "auth.signingUp": "登録処理中…",
      "auth.error.invalidCredential": "メールまたはパスワードが正しくありません。",
      "auth.error.weakPassword": "6文字以上のパスワードを設定してください。",
      "auth.error.emailExists": "既に登録済みのメールです。",
      "auth.error.passwordMismatch": "パスワードが一致しません。",
      "auth.adminOnlyTitle": "管理者権限が必要です",
      "auth.adminOnlyDescription":
        "このページは指定された管理者のみアクセスできます。権限が必要な場合はkoraid運営へお問い合わせください。",
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
      "trendDetail.author.label": "著者",
      "trendDetail.backToList": "トレンド一覧へ",
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
      "profile.badge": "koraid マイページ",
      "profile.title": "プロフィール管理",
      "profile.subtitle": "表示名を更新し、koraidアカウント情報を確認しましょう。",
      "profile.section.identity": "基本情報",
      "profile.section.identityHint": "入力した名前はマイページやパーソナルメールに表示されます。",
      "profile.form.displayName": "表示名",
      "profile.form.displayNamePlaceholder": "例: Haruka Tanaka",
      "profile.form.email": "ログイン用メール",
      "profile.actions.save": "変更を保存",
      "profile.actions.saving": "保存中…",
      "profile.actions.logout": "ログアウト",
      "profile.feedback.success": "プロフィールを更新しました！",
      "profile.errors.displayNameRequired": "表示名を入力してください。",
      "profile.errors.generic": "プロフィールを更新できませんでした。時間をおいて再試行してください。",
      "profile.section.account": "アカウント情報",
      "profile.section.accountHint": "Firebaseメタデータはアカウント保護に利用されます。",
      "profile.account.displayName": "表示名",
      "profile.account.fallbackName": "未設定",
      "profile.account.email": "メールアドレス",
      "profile.account.created": "アカウント作成日",
      "profile.account.lastLogin": "最終ログイン",
      "profile.account.uid": "ユーザーUID",
      "profile.noUser.title": "ログインが必要です",
      "profile.noUser.subtitle": "koraidにログインするとマイページを利用できます。",
      "profile.bookmarks.title": "保存したブックマーク",
      "profile.bookmarks.subtitle":
        "気になるトレンド・イベント・ポップアップをここでチェックできます。",
      "profile.bookmarks.empty":
        "まだブックマークがありません。カードのアイコンから追加してください。",
      "bookmarks.button.save": "ブックマークに追加",
      "bookmarks.button.remove": "ブックマーク解除",
      "bookmarks.actions.view": "開く",
      "bookmarks.actions.remove": "削除",
      "bookmarks.type.trend": "トレンドレポート",
      "bookmarks.type.event": "イベント",
      "bookmarks.type.popup": "ポップアップレーダー",
      "japaneseLanding.badge": "koraid for Japan",
      "japaneseLanding.hero.title": "koraidへようこそ、韓国カルチャーを日本語で",
      "japaneseLanding.hero.subtitle":
        "ソウルを中心にKカルチャーを追いかけるkoraidが、日本語ユーザー向けに最新情報と旅行サポートをまとめました。",
      "japaneseLanding.hero.primary": "日本語で利用を開始",
      "japaneseLanding.hero.secondary": "フランス語版を見る",
      "japaneseLanding.overview.title": "koraidができること",
      "japaneseLanding.overview.items.trend.title": "週間トレンドレポート",
      "japaneseLanding.overview.items.trend.description":
        "現地で話題のポップアップ、カルチャー、街のムードを日本語で要約。旅の参考に。",
      "japaneseLanding.overview.items.event.title": "Kカルチャーイベント検索",
      "japaneseLanding.overview.items.event.description":
        "ライブやフェス、伝統公演まで、日程・エリア別に探せます。",
      "japaneseLanding.overview.items.phrase.title": "旅×カルチャー韓国語",
      "japaneseLanding.overview.items.phrase.description":
        "シーン別フレーズとカルチャーメモを日本語＋ハングル＋発音でセット。",
      "japaneseLanding.cta.title": "koraidと一緒に韓国をもっと身近に",
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
  },
  en: {
    label: "English",
    messages: {
      "nav.home": "Home",
      "nav.trends": "Trend Decoder",
      "nav.events": "Event Calendar",
      "nav.popups": "Pop-up Radar",
      "nav.localSupport": "Local Support",
      "nav.phrasebook": "Phrasebook",
      "nav.cultureTest": "Culture Test",
      "nav.explore": "Discover",
      "nav.admin": "koraid Studio",
      "localSupport.services.title": "Public Service Guide",
      "localSupport.services.subtitle":
        "Step-by-step help for alien registration, health insurance, mobile plans and more with a calendar of deadlines.",
      "localSupport.apps.title": "App Tutorial Hub",
      "localSupport.apps.subtitle":
        "French-friendly walkthroughs for Naver Map, Baemin, Coupang and other essential Korean apps.",
      "localSupport.community.title": "Student & Expat Community",
      "localSupport.community.subtitle":
        "Boards by city/university for Q&A, reviews and meet-ups (e.g. Hanyang Univ. French community).",
      "auth.login": "Log in",
      "auth.logout": "Log out",
      "auth.signup": "Create account",
      "hero.title": "Explore Korea without barriers",
      "hero.subtitle":
        "Weekly trend reports, K-culture events and a personalised phrasebook crafted for global travellers.",
      "hero.cta.primary": "Read the trends",
      "hero.cta.secondary": "See what's new",
      "hero.highlights.title": "koraid at a glance",
      "hero.highlights.cta": "Discover",
      "hero.highlights.trends.title": "Trend Decoder",
      "hero.highlights.trends.description": "Deep dives on Seoul's weekly cultural pulse.",
      "hero.highlights.events.title": "K-Culture Calendar",
      "hero.highlights.events.description": "Filter pop-ups, concerts and festivals by your dates.",
      "hero.highlights.phrasebook.title": "Personal Phrasebook",
      "hero.highlights.phrasebook.description":
        "Save essential expressions with pronunciation and culture notes.",
      "hero.highlights.popups.title": "Pop-up Radar",
      "hero.highlights.popups.description": "Limited drops, design cafés and creator collabs.",
      "hero.ribbon": "koraid MVP",
      "hero.card.title": "Weekly Trend Decoder",
      "hero.card.subtitle": "Han River Sunset Market pop-up",
      "hero.card.caption": "Firebase, Google Maps — integration ready.",
      "hero.spotlight.title": "koraid picks",
      "hero.spotlight.tag.trend": "Trend Decoder",
      "hero.spotlight.tag.event": "Event Calendar",
      "hero.spotlight.tag.phrase": "Phrasebook",
      "hero.spotlight.cta.trend": "Read full story",
      "hero.spotlight.cta.event": "Reserve your spot",
      "hero.spotlight.cta.phrase": "Learn the phrase",
      "hero.spotlight.disclaimer": "Curated picks from the koraid team.",
      "popupRadar.title": "Seongsu Pop-up Radar",
      "popupRadar.subtitle":
        "A three-stop loop to keep up with creator collaborations, concept cafés and limited launches in Seongsu.",
      "popupRadar.sections.overview.title": "Why Seongsu?",
      "popupRadar.sections.overview.body":
        "Former factories turned studios and galleries make Seongsu the fastest neighbourhood for new drops in Seoul.",
      "popupRadar.sections.timeline.title": "Suggested timeline",
      "popupRadar.sections.timeline.note": "Opening hours shift weekly—double-check each brand’s Instagram stories.",
      "popupRadar.sections.timeline.items.morning.title": "Morning – cafés & capsule checks",
      "popupRadar.sections.timeline.items.morning.body":
        "Start with desserts at Layered Seongsu, then head to ADER ERROR Factory for an 11am capsule drop.",
      "popupRadar.sections.timeline.items.afternoon.title": "Afternoon – studios & workshops",
      "popupRadar.sections.timeline.items.afternoon.body":
        "Browse Stand Oil Archive before a silk-screen session at Open Studio (book via Kakao).",
      "popupRadar.sections.timeline.items.evening.title": "Evening – rooftop & night market",
      "popupRadar.sections.timeline.items.evening.body":
        "Sip non-alcoholic cocktails at OR.EO rooftop, then wrap up at Common Ground’s night market.",
      "popupRadar.sections.tips.title": "Quick tips",
      "popupRadar.sections.tips.items.1": "Keep a topped-up T-money card—most pop-ups are cashless.",
      "popupRadar.sections.tips.items.2": "Queues start ~30 minutes before drops. Grab your ticket, then wait nearby.",
      "popupRadar.sections.tips.items.3": "Ask shops to hold your bags so you can move freely between stops.",
      "popupRadar.sections.now.title": "Pop-ups live this week",
      "popupRadar.sections.now.subtitle": "Refreshed weekly. Always confirm hours before heading out.",
      "popupRadar.search.label": "Search pop-ups",
      "popupRadar.search.placeholder": "Try a brand, neighbourhood or tag",
      "popupRadar.search.clear": "Clear",
      "popupRadar.empty": "No pop-ups match this filter yet.",
      "popupRadar.filters.all": "All",
      "popupRadar.filters.now": "Live",
      "popupRadar.filters.soon": "Opening soon",
      "popupRadar.status.now": "Live",
      "popupRadar.status.soon": "Opening soon",
      "popupRadar.cards.cta": "View details",
      "popupRadar.cards.1.name": "Paperhood x Muzikt Studio",
      "popupRadar.cards.1.window": "Through 24 June • 11:00-20:00",
      "popupRadar.cards.1.location": "Layered Seongsu, 2F",
      "popupRadar.cards.1.description":
        "Limited eyewear capsule plus dessert set inspired by Seongsu. First 30 visitors get a silk-screen tote.",
      "popupRadar.cards.1.tags": "capsule,dessert,limited",
      "popupRadar.cards.2.name": "Stand Oil Archive Market",
      "popupRadar.cards.2.window": "20-28 June • 12:00-21:00",
      "popupRadar.cards.2.location": "Stand Oil Archive, Buldang-ro 8",
      "popupRadar.cards.2.description":
        "Bag custom station, upcycling pop-in, and a 3pm postcard stamping session.",
      "popupRadar.cards.2.tags": "design,workshop,upcycling",
      "popupRadar.cards.3.name": "OR.EO Rooftop Listening Bar",
      "popupRadar.cards.3.window": "Nightly • 18:00-23:00",
      "popupRadar.cards.3.location": "OR.EO Rooftop, Seongsu-ro 7",
      "popupRadar.cards.3.description":
        "Zero-proof cocktails curated by guest mixologists plus live DJ playlists. Reserve via Instagram DM.",
      "popupRadar.cards.3.tags": "nightlife,playlist,zero-proof",
      "popupRadar.cta.map": "Open Seongsu map",
      "popupRadar.cta.trends": "Explore more trends",
      "trends.title": "Weekly Trend Decoder",
      "trends.subtitle": "Curated insight on Korean culture trends, in English.",
      "trends.empty": "No trend reports are available right now. Check back soon.",
      "trends.error": "We couldn't load the Trend Decoder.",
      "trends.sample": "View sample",
      "trends.readMore": "Read more",
      "trends.viewAll": "See all trends",
      "trends.byline": "By {author}",
      "events.title": "K-Culture Event Calendar",
      "events.subtitle":
        "Plan your trip with the latest concerts, festivals, workshops and pop-ups.",
      "events.filter.label": "Filter by type",
      "events.filter.all": "All",
      "events.dateFilter.title": "Date range",
      "events.dateFilter.start": "Start date",
      "events.dateFilter.end": "End date",
      "events.dateFilter.reset": "Clear dates",
      "events.empty": "No events match your filters just yet.",
      "events.error": "We couldn't load events right now.",
      "event.eventCategory.concert": "Concert / K-Pop",
      "event.eventCategory.traditional": "Traditional",
      "event.eventCategory.pop-up": "Pop-up / Workshop",
      "event.eventCategory.festival": "Festival",
      "eventDetail.readMore": "See details",
      "phrasebook.title": "Personalised Korean Phrasebook",
      "phrasebook.subtitle":
        "Pick topics you love and memorise essential expressions with transliteration and cultural tips.",
      "phrasebook.category.food": "Food & Dining",
      "phrasebook.category.shopping": "Shopping",
      "phrasebook.category.entertainment": "Culture & Nightlife",
      "phrasebook.completed": "Saved expressions",
      "phrasebook.empty": "No expressions are available yet.",
      "phrasebook.error": "We couldn't load your phrasebook.",
      "phrasebook.search.label": "Search expressions",
      "phrasebook.search.placeholder": "Try dessert, market, 감사합니다…",
      "phrasebook.search.clear": "Clear",
      "phrasebook.search.empty": "No expression matches your search yet.",
      "cultureTest.badge": "K-Culture MBTI",
      "cultureTest.title": "Which Korean traveller are you?",
      "cultureTest.subtitle":
        "Answer five questions to reveal your koraid persona and get curated experiences.",
      "cultureTest.progress.complete": "Your personalised result is ready!",
      "cultureTest.progress.step": "Question {current}/{total}",
      "cultureTest.progress.helper": "Pick the option that feels right, there's no wrong answer.",
      "cultureTest.actions.previous": "Back",
      "cultureTest.actions.reset": "Reset",
      "cultureTest.actions.submit": "See my result",
      "cultureTest.actions.next": "Next",
      "cultureTest.actions.share": "Share my profile",
      "cultureTest.actions.retry": "Restart test",
      "cultureTest.share.title": "koraid Culture Test",
      "cultureTest.share.text": "My koraid profile: {result}. What's yours?",
      "cultureTest.share.copied": "Link copied!",
      "cultureTest.share.error": "We couldn't share your result right now.",
      "cultureTest.hint.title": "How the test works",
      "cultureTest.hint.subtitle":
        "Each answer feeds into koraid’s four traveller archetypes.",
      "cultureTest.hint.item.1": "Follow your current vibe, there's no wrong choice.",
      "cultureTest.hint.item.2": "We mix trends, food, heritage and slow travel data points.",
      "cultureTest.hint.item.3": "You can go back or restart whenever you like.",
      "cultureTest.result.badge": "Your koraid profile",
      "cultureTest.result.highlight": "Ideas to explore",
      "cultureTest.result.next.title": "Next steps",
      "cultureTest.result.next.subtitle":
        "Discover trends, events and phrases matched to your vibe.",
      "cultureTest.questions.pace.title": "First day in Seoul: what's your pace?",
      "cultureTest.questions.pace.subtitle": "Choose the scene that sounds most like you.",
      "cultureTest.questions.pace.answers.trendsetter":
        "Hop across pop-up launches and K-pop collabs from the morning.",
      "cultureTest.questions.pace.answers.foodie":
        "Start with street food bites and a local market crawl.",
      "cultureTest.questions.pace.answers.wellness":
        "Wake up for sunrise in a park, then slow coffee and journaling.",
      "cultureTest.questions.pace.answers.heritage":
        "Stroll through palaces and hanok alleys at your own pace.",
      "cultureTest.questions.morning.title": "What do you book before flying out?",
      "cultureTest.questions.morning.subtitle": "Pick the activity you never skip.",
      "cultureTest.questions.morning.answers.trendsetter":
        "A table at the newest hybrid restaurant in Seongsu.",
      "cultureTest.questions.morning.answers.foodie":
        "A kimchi-making class or a late-night tteokbokki tour.",
      "cultureTest.questions.morning.answers.wellness":
        "Spa & jjimjilbang session with massage included.",
      "cultureTest.questions.morning.answers.heritage":
        "A hanji, calligraphy or custom hanbok workshop.",
      "cultureTest.questions.souvenir.title": "Must-pack souvenir?",
      "cultureTest.questions.souvenir.subtitle":
        "Picture what you'll slip into your carry-on.",
      "cultureTest.questions.souvenir.answers.trendsetter":
        "A limited drop from a Seoul concept brand.",
      "cultureTest.questions.souvenir.answers.foodie":
        "Craft gochujang or Jeju sea salt.",
      "cultureTest.questions.souvenir.answers.wellness":
        "Clean beauty skincare with green tea and citrus.",
      "cultureTest.questions.souvenir.answers.heritage":
        "Ceramics or a custom seal with your name in hangul.",
      "cultureTest.questions.evening.title": "Perfect Seoul night?",
      "cultureTest.questions.evening.subtitle": "The story you'd post on your feed.",
      "cultureTest.questions.evening.answers.trendsetter":
        "Hongdae rooftop with K-hip-hop and city lights.",
      "cultureTest.questions.evening.answers.foodie":
        "Food tent hopping then bingsu dessert.",
      "cultureTest.questions.evening.answers.wellness":
        "Night-time observatory soak with tea and skyline.",
      "cultureTest.questions.evening.answers.heritage":
        "National Theater performance then Cheonggyecheon walk.",
      "cultureTest.questions.motto.title": "Your travel motto?",
      "cultureTest.questions.motto.subtitle": "Pick the sentence that captures your tone.",
      "cultureTest.questions.motto.answers.trendsetter":
        "\"If it's trending today, I experience it tomorrow.\"",
      "cultureTest.questions.motto.answers.foodie":
        "\"Taste it all, from markets to fine dining.\"",
      "cultureTest.questions.motto.answers.wellness":
        "\"Slow down and let the city breathe.\"",
      "cultureTest.questions.motto.answers.heritage":
        "\"Every neighbourhood tells a story.\"",
      "cultureTest.results.trendsetter.title": "Seoul trendsetter",
      "cultureTest.results.trendsetter.description":
        "Always scanning for hybrid concepts and buzzy launches, you turn trips into living moodboards.",
      "cultureTest.results.trendsetter.highlights.1":
        "Keep tabs on pop-ups in Seongsu, DDP and Hannam with koraid alerts.",
      "cultureTest.results.trendsetter.highlights.2":
        "Schedule a signature café visit and an immersive exhibition.",
      "cultureTest.results.trendsetter.highlights.3":
        "Use the Trend Decoder feed to catch collab drops first.",
      "cultureTest.results.foodie.title": "K-food explorer",
      "cultureTest.results.foodie.description":
        "Markets, modern hansik tables and oversized desserts map out your Korean journey.",
      "cultureTest.results.foodie.highlights.1":
        "Pair Gwangjang street food with a modern hansik dinner.",
      "cultureTest.results.foodie.highlights.2":
        "Browse artisan jang, tea and confectionery boutiques.",
      "cultureTest.results.foodie.highlights.3":
        "Save favourite expressions in your Phrasebook to use on-site.",
      "cultureTest.results.wellness.title": "Slow & healing traveller",
      "cultureTest.results.wellness.description":
        "Urban forests, hot springs and tranquil cafés are your must-haves.",
      "cultureTest.results.wellness.highlights.1":
        "Blend a design jjimjilbang, tea house and Bugaksan meditation.",
      "cultureTest.results.wellness.highlights.2":
        "Seek calming cafés across Seochon, Ikseon and even Gapado.",
      "cultureTest.results.wellness.highlights.3":
        "Scan our Event Calendar for breathwork retreats and yoga pop-ups.",
      "cultureTest.results.heritage.title": "Heritage storyteller",
      "cultureTest.results.heritage.description":
        "Historical quarters, artisans and classic performances fill your notebooks.",
      "cultureTest.results.heritage.highlights.1":
        "Book a Bukchon guided walk, hanji workshop and pansori show.",
      "cultureTest.results.heritage.highlights.2":
        "Take your time in craft-focused museums and galleries.",
      "cultureTest.results.heritage.highlights.3":
        "Use Trend Decoder to track artist residencies opening to the public.",
      "trendDetail.notFound": "Trend not found",
      "trendDetail.notFoundSubtitle": "The link may have expired or moved.",
      "trendDetail.goBack": "Go back",
      "trendDetail.back": "Back",
      "trendDetail.sidebarTitle": "Highlights",
      "trendDetail.neighborhood": "Neighbourhood",
      "trendDetail.intensity": "Vibe",
      "trendDetail.intensity.highlight": "Unmissable hotspot",
      "trendDetail.intensity.insider": "Local insider",
      "trendDetail.intensity.emerging": "Emerging trend",
      "trendDetail.published": "Published",
      "trendDetail.author.label": "Written by",
      "trendDetail.backToList": "Back to trends",
      "eventDetail.notFound": "Event not found",
      "eventDetail.notFoundSubtitle": "It may have been cancelled or rescheduled.",
      "eventDetail.goBack": "Go back",
      "eventDetail.back": "Back",
      "eventDetail.tipsTitle": "Good to know",
      "eventDetail.infoTitle": "Key info",
      "eventDetail.when": "Date",
      "eventDetail.where": "Location",
      "eventDetail.price": "Price",
      "eventDetail.bookingCta": "Book now",
      "eventDetail.backToList": "See more events",
      "eventDetail.discoverTrends": "Explore the Trend Decoder",
      "profile.badge": "koraid profile",
      "profile.title": "Manage your koraid profile",
      "profile.subtitle":
        "Update your display name and review the secure metadata tied to your account.",
      "profile.section.identity": "Identity",
      "profile.section.identityHint":
        "This name appears in your personalised areas and communications.",
      "profile.form.displayName": "Display name",
      "profile.form.displayNamePlaceholder": "E.g. Alex Morgan",
      "profile.form.email": "Login email",
      "profile.actions.save": "Save changes",
      "profile.actions.saving": "Saving…",
      "profile.actions.logout": "Log out",
      "profile.feedback.success": "Profile updated!",
      "profile.errors.displayNameRequired": "Please enter a display name.",
      "profile.errors.generic": "We couldn't save your profile. Try again later.",
      "profile.section.account": "Account details",
      "profile.section.accountHint":
        "These Firebase metadata fields help protect your koraid account.",
      "profile.account.displayName": "Display name",
      "profile.account.fallbackName": "Not set",
      "profile.account.email": "Email",
      "profile.account.created": "Account created",
      "profile.account.lastLogin": "Last sign-in",
      "profile.account.uid": "User UID",
      "profile.noUser.title": "Please log in",
      "profile.noUser.subtitle": "Sign in to access your personal koraid page.",
      "profile.bookmarks.title": "Saved bookmarks",
      "profile.bookmarks.subtitle": "All your saved trends, events and pop-ups in one place.",
      "profile.bookmarks.empty":
        "No bookmarks yet. Tap the bookmark icon on any koraid card to save it.",
      "bookmarks.button.save": "Save bookmark",
      "bookmarks.button.remove": "Remove bookmark",
      "bookmarks.actions.view": "Open",
      "bookmarks.actions.remove": "Remove",
      "bookmarks.type.trend": "Trend report",
      "bookmarks.type.event": "Event",
      "bookmarks.type.popup": "Pop-up radar",
      "footer.madeIn": "Designed in Seoul for global travellers",
      "admin.title": "koraid Studio",
      "admin.subtitle":
        "Add new trends, events and expressions without writing code. Entries are stored in your browser and appear instantly.",
      "admin.stats.trends": "Published trends: {count}",
      "admin.stats.events": "Published events: {count}",
      "admin.stats.phrases": "Published expressions: {count}",
      "admin.session": "Signed in as {email}",
      "admin.actions.reset": "Clear local additions",
      "admin.feedback.trendSaved": "Trend saved.",
      "admin.feedback.eventSaved": "Event saved.",
      "admin.feedback.phraseSaved": "Expression saved.",
      "admin.feedback.error": "Something went wrong. Try again.",
      "admin.feedback.cleared": "Local additions cleared.",
      "admin.trend.title": "Add a trend",
      "admin.trend.description":
        "Fill the fields and click “Save”. trends remain visible to signed-in users only.",
      "admin.trend.submit": "Save trend",
      "admin.event.title": "Add a K-culture event",
      "admin.event.description":
        "Provide key details so travellers can book quickly.",
      "admin.event.submit": "Save event",
      "admin.event.category.concert": "Concert / K-Pop",
      "admin.event.category.traditional": "Traditional",
      "admin.event.category.popup": "Pop-up / Workshop",
      "admin.event.category.festival": "Festival",
      "admin.phrase.title": "Add an expression",
      "admin.phrase.description":
        "Share helpful phrases from the field. They appear in the personalised phrasebook.",
      "admin.phrase.submit": "Save expression",
      "admin.form.title": "Title",
      "admin.form.neighborhood": "Neighbourhood / Area",
      "admin.form.summary": "Summary (max 2 sentences)",
      "admin.form.details": "Detail (list view)",
      "admin.form.tags": "Tags (comma-separated)",
      "admin.form.imageUrl": "Image URL",
      "admin.form.content": "Long content (separate paragraphs with a blank line)",
      "admin.form.intensity.highlight": "Highlight (unmissable)",
      "admin.form.intensity.insider": "Insider (local pick)",
      "admin.form.intensity.emerging": "Emerging (trending soon)",
      "admin.form.saving": "Saving…",
      "admin.form.location": "Location / Nearby station",
      "admin.form.price": "Price (ex: 49€ or Free)",
      "admin.form.bookingUrl": "Booking link (optional)",
      "admin.form.longDescription": "Long description (one paragraph per line break)",
      "admin.form.tips": "Tips (one per line)",
      "admin.form.korean": "Expression in Korean",
      "admin.form.transliteration": "Pronunciation (transliteration)",
      "admin.form.language": "Language",
      "admin.form.author": "Author",
      "admin.form.translation": "Translation (for selected language)",
      "admin.form.culturalNote": "Culture note (optional)",
      "auth.badge": "Secure access",
      "auth.title": "Sign in to koraid",
      "auth.subtitle":
        "Log in to access your favourites. koraid Studio remains for the team only.",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.submit": "Sign in",
      "auth.loggingIn": "Signing in…",
      "auth.error.unauthorisedEmail":
        "This email is not authorised. Contact the koraid team.",
      "auth.footer.hint": "Credentials are managed via Firebase. Contact the admin if lost.",
      "auth.footer.support": "Need help? Team@kor-aid.com",
      "auth.loading": "Loading the secure workspace…",
      "auth.firebaseError": "Unable to display the admin area (missing Firebase config).",
      "auth.loginWithGoogle": "Continue with Google",
      "auth.googleLoading": "Google sign-in…",
      "auth.or": "or",
      "auth.noAccount": "No account yet?",
      "auth.goToSignup": "Create access",
      "auth.haveAccount": "Already registered?",
      "auth.goToLogin": "Go to login",
      "auth.signupTitle": "Create a koraid account",
      "auth.signupSubtitle":
        "Create your koraid account and save what you love. Team access is required for the Studio.",
      "auth.passwordConfirm": "Confirm password",
      "auth.createAccount": "Create account",
      "auth.signingUp": "Signing up…",
      "auth.error.invalidCredential": "Email or password is incorrect.",
      "auth.error.weakPassword": "Please use at least 6 characters.",
      "auth.error.emailExists": "This email is already registered.",
      "auth.error.passwordMismatch": "Passwords do not match.",
      "auth.adminOnlyTitle": "Admin access required",
      "auth.adminOnlyDescription":
        "This page is restricted to approved admins. Reach out to koraid HQ if you need access.",
      "auth.adminOnlyCta": "Return home"
    }
  }
};

type I18nContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);
const LANGUAGE_STORAGE_KEY = "koraid.language";
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["fr", "ko", "ja", "en"];

function normalizeLanguage(lang?: string | null): SupportedLanguage | null {
  if (!lang) return null;
  const lower = lang.toLowerCase();
  return SUPPORTED_LANGUAGES.find((item) => item === lower) ?? null;
}

function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "fr";

  const url = new URL(window.location.href);
  const queryLang = normalizeLanguage(url.searchParams.get("lang"));
  if (queryLang) return queryLang;

  const pathSegment = window.location.pathname.split("/")[1];
  const pathLang = normalizeLanguage(pathSegment);
  if (pathLang) return pathLang;

  const storedLang = normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  if (storedLang) return storedLang;

  const navigatorLang = normalizeLanguage(window.navigator.language?.slice(0, 2));
  if (navigatorLang) return navigatorLang;

  return "fr";
}

function persistLanguage(lang: SupportedLanguage) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // ignore storage errors (e.g., private mode)
  }
  const url = new URL(window.location.href);
  const firstSegment = url.pathname.split("/")[1];
  if (normalizeLanguage(firstSegment)) {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", lang);
  }
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, "", nextUrl);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => detectInitialLanguage());

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    persistLanguage(lang);
  }, []);

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
