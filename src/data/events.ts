export type EventCategory = "concert" | "traditional" | "pop-up" | "festival";

export type KCultureEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  price: string;
  bookingUrl?: string;
  imageUrl: string;
  longDescription: string[];
  tips: string[];
};

export const K_CULTURE_EVENTS: KCultureEvent[] = [
  {
    id: "aespa-arena",
    title: "Aespa Hyperline Tour - Séoul",
    description:
      "Concert K-Pop avec zones d'expérience VR avant le show. Guides en français disponibles sur place.",
    date: "2024-07-13",
    time: "19:30",
    location: "KSPO Dome, Séoul",
    category: "concert",
    price: "89€",
    imageUrl:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
    longDescription: [
      "La tournée Hyperline d'Aespa arrive à Séoul avec un dispositif immersif : zones VR avant le show, chorégraphies interactives et merchandising en édition limitée.",
      "Les portes ouvrent à 17h et la zone VR se remplit très vite : conseillez à vos lecteurs/rices de réserver un créneau dans l'app officielle SM. Les détenteurs de billets VIP reçoivent une session de meet & greet de 5 minutes."
    ],
    tips: [
      "Prévoir une arrivée deux heures avant l'ouverture des portes pour profiter de la zone expérience.",
      "Téléchargez l'app SM Town : des sous-titres français sont disponibles pour le pre-show briefing."
    ]
  },
  {
    id: "bukchon-hanok-night",
    title: "Nuit Hanbok & Photowalk",
    description:
      "Visite nocturne de Bukchon Hanok Village avec prêt de hanbok premium et photographe francophone.",
    date: "2024-07-15",
    time: "20:00",
    location: "Bukchon Hanok Village, Séoul",
    category: "traditional",
    price: "49€",
    bookingUrl: "https://example.com/bukchon-night",
    imageUrl:
      "https://images.unsplash.com/photo-1560944527-a4a429848866?auto=format&fit=crop&w=1600&q=80",
    longDescription: [
      "Au cœur de Bukchon, ce photowalk nocturne propose la location de hanbok premium, un stylisme express et un photographe francophone qui guide chaque pose.",
      "Le parcours inclut trois points de vue incontournables : Samcheongdong-gil, la ruelle des toits et un salon de thé secret pour une pause douce avec tisanes coréennes."
    ],
    tips: [
      "Choisissez le créneau de 20h pour éviter la foule et profiter du coucher du soleil sur les toits.",
      "Préparez deux accessoires personnels (sac, éventail) pour personnaliser les photos souvenirs."
    ]
  },
  {
    id: "makgeolli-class",
    title: "Atelier Makgeolli x Fromage",
    description:
      "Atelier fusion où un maître brasseur explique comment accorder makgeolli et fromages français.",
    date: "2024-07-18",
    time: "18:00",
    location: "Seongsu Silo Lab, Séoul",
    category: "pop-up",
    price: "35€",
    imageUrl:
      "https://images.unsplash.com/photo-1514516345957-556ca7d90a8f?auto=format&fit=crop&w=1600&q=80",
    longDescription: [
      "Le maître brasseur Kim Min-su explique l'art du makgeolli et propose des accords inattendus avec des fromages français importés par une fromagerie de Hongdae.",
      "L'atelier se termine par un mini-lab où chaque participant ajoute ses toppings (yuzu, basilic asiatique, gingembre) pour créer sa propre cuvée."
    ],
    tips: [
      "Nombre de places limité à 14 personnes. Réservez à l'avance via Naver Booking.",
      "Apportez une boîte isotherme si vous souhaitez repartir avec une bouteille souvenir."
    ]
  },
  {
    id: "jeonju-festival",
    title: "Festival de gastronomie Jeonju",
    description:
      "Découverte des spécialités de Jeonju avec stands francophones et mini ateliers de cuisine.",
    date: "2024-07-20",
    time: "12:00",
    location: "Gare de Jeonju - zone événements",
    category: "festival",
    price: "Entrée libre",
    imageUrl:
      "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=1600&q=80",
    longDescription: [
      "Jeonju, capitale gastronomique, organise un festival mettant en avant bibimbap revisité, dégustations de kimchi premium et ateliers de temple food.",
      "Un train spécial relie Séoul à Jeonju en 1h40 et inclut un snack coréen créé pour l'occasion."
    ],
    tips: [
      "Réservez le KTX du matin pour profiter de toute la journée et revenir dans la soirée.",
      "Passez au stand \"Découverte makgeolli\" pour une initiation gratuite aux accords culinaires."
    ]
  }
];
