import type { SupportedLanguage } from "../shared/i18n";

export type PopupStatus = "now" | "soon";

export type PopupEvent = {
  id: string;
  language: SupportedLanguage;
  title: string;
  brand: string;
  window: string;
  status: PopupStatus;
  location: string;
  posterUrl: string;
  heroImageUrl: string;
  tags: string[];
  description: string;
  highlights: string[];
  details: string[];
  reservationUrl?: string;
};

export const POPUP_EVENTS: PopupEvent[] = [];
