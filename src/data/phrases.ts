import type { SupportedLanguage } from "../shared/i18n";

export type PhraseCategory = "food" | "shopping" | "entertainment";

export type Phrase = {
  id: string;
  language: SupportedLanguage;
  hidden?: boolean;
  korean: string;
  transliteration: string;
  translation: string;
  culturalNote: string;
  category: PhraseCategory;
};

export const PHRASES: Phrase[] = [];
