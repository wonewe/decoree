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
  imageUrl: string;
  content: string[];
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
    publishedAt: "2024-06-03",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Les rives du fleuve Han se transforment en laboratoire de tendances : pendant tout le mois de juin, la Sunset Market accueille des designers coréens qui revisitent les codes des pop-up stores parisiens.",
      "Chaque week-end, l'expérience débute dès 16h avec des corners DIY, une sélection de street food imaginée par des chefs invités et un line-up de DJ locaux qui prennent le relais au coucher du soleil.",
      "À noter pour vos lecteurs/rices : réservez les sessions \"Sunset DJ\" via l'app officielle (onglet VIP) et arrivez 30 minutes en avance pour profiter de la golden hour sur Yeouido."
    ]
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
    publishedAt: "2024-06-05",
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Needle & Beam s'inspire des listening bars new-yorkais mais y ajoute la touche K-Indie : une sélection de vinyles pressés à Séoul, des playlists hebdomadaires commentées par des DJ et un bar à desserts inspiré par les dramas phares.",
      "Les tables sont limitées à 40 places : conseillez à vos lecteurs/rices de réserver le créneau de 19h via KakaoTalk. Les détenteurs d'un abonnement Decorée Premium reçoivent un code de priorité.",
      "Le lieu propose aussi des sessions \"vinyle à emporter\" chaque dimanche matin, parfait pour ramener un souvenir pointu aux fans de musique alternative coréenne."
    ]
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
    publishedAt: "2024-06-02",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Busan Ocean Film Night réunit les amoureux de la mer et du cinéma : chaque vendredi de juillet, un écran géant flotte face à Haeundae Beach pour des projections gratuites.",
      "Les masterclasses express (25 minutes) sont animées par des réalisateurs coréens qui décryptent leurs dernières sorties sur Netflix et les tendances du marché local.",
      "Le pass backstage (29 000 KRW) offre un accès à un lounge en rooftop avec dégustation de makgeolli local et rencontre avec la programmation du festival."
    ]
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
    publishedAt: "2024-06-08",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1600&q=80",
    content: [
      "La chef pâtissière Han Ye-rin, formée à Lyon, imagine des desserts hybrides : kouign-amann au miso-caramel, Saint-Honoré au yuzu et bibim-bun sucré/salé garni de légumes marinés.",
      "Chaque samedi, un atelier bilingue (FR/KR) accueille 8 personnes pour apprendre à maîtriser la pâte feuilletée coréenne. Les abonnés Decorée Premium obtiennent un accès prioritaire.",
      "Conseil logistique : le quartier d'Haebangchon étant très escarpé, recommandez un trajet en taxi depuis Itaewon (moins de 5 minutes) pour vos lecteurs/rices chargés de paquets."
    ]
  }
];
