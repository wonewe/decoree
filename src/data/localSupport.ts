export type ServiceGuide = {
  id: string;
  title: string;
  summary: string;
  checklist: string[];
  calendar: string[];
};

export type AppTutorial = {
  id: string;
  name: string;
  summary: string;
  steps: string[];
  tips: string[];
};

export type CommunityBoard = {
  id: string;
  name: string;
  summary: string;
  highlights: string[];
  contact: string;
};

export const SERVICE_GUIDES: ServiceGuide[] = [
  {
    id: "alien-registration",
    title: "Alien registration",
    summary: "Planifier son rendez-vous et suivre les échéances de carte de séjour.",
    checklist: [
      "Réserver un créneau HiKorea (immigration)",
      "Préparer passeport, photo, contrat logement, cash fee",
      "Récupérer l'ARC et ajouter rappel de renouvellement"
    ],
    calendar: [
      "Arrivée J+14 : déposer le dossier",
      "ARC prêt sous 2-3 semaines",
      "Renouvellement à J-60"
    ]
  },
  {
    id: "nhis",
    title: "Assurance santé (NHIS)",
    summary: "Comprendre l'inscription automatique et les paiements.",
    checklist: [
      "Vérifier l'inscription automatique après ARC",
      "Créer un compte sur l'app NHIS (guide FR)",
      "Configurer prélèvement automatique"
    ],
    calendar: ["J+30 : première cotisation", "Tous les 25 du mois : prélèvement"]
  },
  {
    id: "telecom",
    title: "Mobile & internet",
    summary: "Comparer eSIM, prépayé et post-payé + ouvrir compte bancaire.",
    checklist: [
      "Choisir opérateur (LG U+, KT, SK) via comparatif FR",
      "Obtenir carte bancaire (K bank / KakaoBank)",
      "Relier factures et configurer alertes"
    ],
    calendar: ["J+1 : activation SIM", "Mensuel : paiement facture"]
  }
];

export const APP_TUTORIALS: AppTutorial[] = [
  {
    id: "naver-map",
    name: "Naver Map",
    summary: "Sauvegarder des parcours et partager sa géolocalisation.",
    steps: [
      "Passer l'interface en anglais et ajouter la couche " +
        "Tips FR",
      "Créer des dossiers de favoris par quartier",
      "Partager sa localisation live via Kakao"
    ],
    tips: ["Utiliser street view 3D", "Activer layer metro", "Importer un itinéraire Google"]
  },
  {
    id: "baemin",
    name: "Baedal Minjok",
    summary: "Commander en livraison avec cartes internationales.",
    steps: [
      "Traduire les menus via screenshot intégré",
      "Ajouter une carte étrangère via KakaoPay",
      "Rédiger les notes livreur (FR+KR)"
    ],
    tips: ["Filtrer restaurants FR friendly", "Programmer livraison", "Utiliser coupons"]
  },
  {
    id: "coupang",
    name: "Coupang",
    summary: "Utiliser WOW, lockers et retours express.",
    steps: [
      "Activer l'essai WOW avec carte internationale",
      "Choisir les casiers QuickFlex",
      "Planifier un retour pick-up"
    ],
    tips: ["Ajouter destinataire en romanisation", "Suivre colis dans KakaoTalk"]
  }
];

export const COMMUNITY_BOARDS: CommunityBoard[] = [
  {
    id: "hanyang",
    name: "한양대 · Seoul",
    summary: "Groupe francophone pour AMT + vie sur campus.",
    highlights: [
      "Q&A dortoirs",
      "Covoiturage concerts",
      "Calendrier sorties"
    ],
    contact: "@decoree.hanyang"
  },
  {
    id: "yonsei",
    name: "연세대 · Sinchon",
    summary: "Buddy system FR/KR et offres de stage.",
    highlights: ["Buddy brunch", "Partage de stages", "Clubs culture"],
    contact: "@decoree.yonsei"
  },
  {
    id: "busan-jeju",
    name: "부산 / 제주",
    summary: "Communauté expat pour sud de la Corée.",
    highlights: ["Tips ferry/vol", "Colocs disponibles", "Meetups plage"],
    contact: "@decoree.busan"
  }
];
