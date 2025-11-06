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
    price: "89€"
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
    bookingUrl: "https://example.com/bukchon-night"
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
    price: "35€"
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
    price: "Entrée libre"
  }
];
