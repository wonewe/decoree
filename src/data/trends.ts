export type TrendIntensity = "highlight" | "insider" | "emerging";

export type TrendReport = {
  id: string;
  title: string;
  summary: string;
  details: string;
  neighborhood: string;
  tags: string[];
  intensity: TrendIntensity;
  isPremium: boolean;
  publishedAt: string;
};

export const TREND_REPORTS: TrendReport[] = [
  {
    id: "hanriver-concept-store",
    title: "Pop-up Han River Sunset Market",
    summary:
      "Concept-store en plein air sur les rives du fleuve Han, mêlant marques de jeunes créateurs et stands de street food.",
    details:
      "Chaque week-end de juin, le marché rassemble une sélection de designers coréens émergents. Accès libre en journée, réservation nécessaire pour les sessions Sunset DJ.",
    neighborhood: "Yeouido",
    tags: ["pop-up", "mode", "street food"],
    intensity: "highlight",
    isPremium: false,
    publishedAt: "2024-06-03"
  },
  {
    id: "seongsu-vinyl",
    title: "K-Indie Listening Room x Café",
    summary:
      "Nouvelle salle d'écoute dédiée à la scène K-Indie avec dégustation de desserts inspirés de K-dramas.",
    details:
      "Le café 'Needle & Beam' propose des cartes de cocktails sans alcool et des playlists hebdomadaires sélectionnées par des DJ locaux. Réservation conseillée le soir.",
    neighborhood: "Seongsu-dong",
    tags: ["café", "musique", "k-indie"],
    intensity: "insider",
    isPremium: true,
    publishedAt: "2024-06-05"
  },
  {
    id: "busan-festival",
    title: "Busan Ocean Film Night",
    summary:
      "Projection en plein air de courts-métrages et masterclasses express autour du cinéma coréen.",
    details:
      "Festival gratuit les vendredis de juillet. Possibilité d'ajouter un pass backstage premium avec rencontre de réalisateurs.",
    neighborhood: "Busan Haeundae",
    tags: ["cinéma", "festival", "océan"],
    intensity: "emerging",
    isPremium: false,
    publishedAt: "2024-06-02"
  },
  {
    id: "haebangchon-boulangerie",
    title: "Pâtisserie Fusion Bibim-Bun",
    summary:
      "Boulangerie artisanale qui revisite les classiques français (kouign-amann, mille-feuille) avec des ingrédients coréens.",
    details:
      "Options végétariennes avec sauces gochujang adoucies. Les ateliers de pâtisserie sont accessibles aux visiteurs étrangers, uniquement sur abonnement premium.",
    neighborhood: "Haebangchon",
    tags: ["pâtisserie", "atelier", "fusion"],
    intensity: "highlight",
    isPremium: true,
    publishedAt: "2024-06-08"
  }
];
