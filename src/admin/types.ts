import type { TrendReport, TrendIntensity } from "../data/trends";
import type { KCultureEvent, EventCategory } from "../data/events";
import type { Phrase, PhraseCategory } from "../data/phrases";
import type { PopupEvent, PopupStatus } from "../data/popups";
import type { SupportedLanguage } from "../shared/i18n";

export type ContentType = "trends" | "events" | "phrases" | "popups";

export type AdminMessage = {
  tone: "success" | "error" | "info";
  text: string;
};

export type TrendDraft = {
  id: string;
  language: SupportedLanguage;
  languages: SupportedLanguage[];
  hidden: boolean;
  authorId: string;
  title: string;
  summary: string;
  details: string;
  neighborhood: string;
  tagsInput: string;
  intensity: TrendIntensity;
  publishedAt: string;
  imageUrl: string;
  contentInput: string;
};

export type EventDraft = {
  id: string;
  language: SupportedLanguage;
  languages: SupportedLanguage[];
  hidden: boolean;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  mapQuery: string;
  category: EventCategory;
  price: string;
  bookingUrl: string;
  imageUrl: string;
  longDescriptionInput: string;
  tipsInput: string;
};

export type PhraseDraft = {
  id: string;
  language: SupportedLanguage;
  languages: SupportedLanguage[];
  hidden: boolean;
  korean: string;
  transliteration: string;
  translation: string;
  culturalNote: string;
  category: PhraseCategory;
};

export type PopupDraft = {
  id: string;
  language: SupportedLanguage;
  languages: SupportedLanguage[];
  hidden: boolean;
  title: string;
  brand: string;
  window: string;
  status: PopupStatus;
  startDate: string;
  endDate: string;
  location: string;
  mapQuery: string;
  posterUrl: string;
  heroImageUrl: string;
  tagsInput: string;
  description: string;
  highlightsInput: string;
  detailsInput: string;
  reservationUrl: string;
};

// Re-export for convenience
export type { TrendReport, KCultureEvent, Phrase, PopupEvent };
export type { TrendIntensity, EventCategory, PhraseCategory, PopupStatus };
