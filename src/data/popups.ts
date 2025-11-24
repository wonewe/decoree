import type { SupportedLanguage } from "../shared/i18n";

export type PopupStatus = "now" | "soon" | "ended";

export type PopupEvent = {
  id: string;
  language: SupportedLanguage;
  title: string;
  brand: string;
  window: string;
  status: PopupStatus;
  startDate?: string;
  endDate?: string;
  location: string;
  mapQuery?: string;
  posterUrl: string;
  heroImageUrl: string;
  tags: string[];
  description: string;
  highlights: string[];
  details: string[];
  reservationUrl?: string;
};

export const POPUP_EVENTS: PopupEvent[] = [
  {
    id: "en-seongsu-archive-capsule",
    language: "en",
    title: "Archive Capsule Room",
    brand: "Layered x Atelier Blu",
    window: "Now - Aug 25 • 11:00-21:00",
    status: "now",
    startDate: "2024-07-15",
    endDate: "2024-08-25",
    location: "Seongsu-dong, Seoul",
    mapQuery: "성수동 카페 레이어드",
    posterUrl: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6",
    heroImageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    tags: ["capsule", "dessert", "design"],
    description: "Dessert lab meets mini gallery: limited soft-serve, merch drops, and a postcard press corner.",
    highlights: [
      "Daily drop at 14:00 with 50 sets only",
      "Live postcard stamping with Atelier Blu illustrator",
      "Reusable cup discount for coffee orders"
    ],
    details: [
      "The capsule is split into three rooms: archive wall, tasting bar, and merch corner. Each space rotates artists every two weeks.",
      "Postcard press is free with any drink; bring your own tote for the screen print table on weekends.",
      "Queues start before noon on Saturdays. Staff hand out numbered bracelets to manage entry."
    ],
    reservationUrl: "https://layered-capsule.example.com"
  },
  {
    id: "en-itaewon-zero-proof-lab",
    language: "en",
    title: "Zero-Proof Listening Lab",
    brand: "Soft Spirits Club",
    window: "Aug 10 - Sep 1 • 17:00-23:00",
    status: "soon",
    startDate: "2024-08-10",
    endDate: "2024-09-01",
    location: "Itaewon, Seoul",
    mapQuery: "이태원 제로프루프 바",
    posterUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    heroImageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e",
    tags: ["night", "listening", "zero-proof"],
    description: "Vinyl-first lounge with low-ABV cocktails, tea pairings, and a rotating DJ guest list.",
    highlights: [
      "Two seatings per night with pre-booked playlists",
      "Limited glassware collab with a Seoul-based ceramicist",
      "Snack pairing by a Hannam bistro (changes weekly)"
    ],
    details: [
      "Reserve via DM to get a QR check-in. The front desk offers a headphone tasting of the night's records.",
      "The bar runs a no-standing policy; 24 seats total. Arrive on time to keep your slot.",
      "Cocktail list leans zero-proof; a short list of local craft beer is available after 21:00."
    ],
    reservationUrl: "https://softspiritsclub.example.com"
  },
  {
    id: "en-jeju-seaside-print-shop",
    language: "en",
    title: "Seaside Print Shop",
    brand: "Ganse Studio",
    window: "Now - Sep 5 • 10:00-18:00",
    status: "now",
    startDate: "2024-07-01",
    endDate: "2024-09-05",
    location: "Aewol, Jeju",
    mapQuery: "제주 애월 간세 스튜디오",
    posterUrl: "https://images.unsplash.com/photo-1523419400524-a5e549c1f4de",
    heroImageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    tags: ["coastal", "print", "workshop"],
    description: "Coastal risograph studio with weekend tote printing, postcard bundles, and a slow coffee bar.",
    highlights: [
      "Sunset deck open until 19:00 for drink holders",
      "Weekend risograph workshop (book on-site)",
      "Local dessert pairing from a nearby bakery"
    ],
    details: [
      "The main room hosts a rotating zine wall featuring Jeju illustrators. Most titles are limited to 150 copies.",
      "Tote printing uses two-color riso; pick from four Jeju-inspired stencils or bring your own A4 line art.",
      "No reservation needed on weekdays. On weekends, the workshop fills by noon; come early to get a slot."
    ],
    reservationUrl: "https://ganse-studio.example.com"
  }
];
