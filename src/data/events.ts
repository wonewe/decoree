import type { SupportedLanguage } from "../shared/i18n";

export type EventCategory = "concert" | "traditional" | "atelier" | "theatre" | "festival";

export type KCultureEvent = {
  id: string;
  language: SupportedLanguage;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  category: EventCategory;
  price: string;
  bookingUrl?: string;
  imageUrl: string;
  longDescription: string[];
  tips: string[];
};

export const K_CULTURE_EVENTS: KCultureEvent[] = [];
