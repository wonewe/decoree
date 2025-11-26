import type { TrendReport } from "../../data/trends";
import type { KCultureEvent } from "../../data/events";
import type { Phrase } from "../../data/phrases";
import type { PopupEvent } from "../../data/popups";
import type { SupportedLanguage } from "../../shared/i18n";
import { translateBatch } from "./translationClient";

export const STUDIO_AUTO_TRANSLATE_ENABLED =
  import.meta.env.VITE_STUDIO_AUTO_TRANSLATE !== "false";

const ensureArray = (values?: string[]) => (values ? [...values] : []);

const hasMediaHtml = (value: string) => /<(img|figure|video|iframe)\b/i.test(value);

async function translateFields(
  texts: string[],
  sourceLanguage: SupportedLanguage | undefined,
  targetLanguage: SupportedLanguage
) {
  if (!STUDIO_AUTO_TRANSLATE_ENABLED) return null;
  if (!sourceLanguage || sourceLanguage === targetLanguage) return null;
  const result = await translateBatch(texts, sourceLanguage, targetLanguage);
  return result.values;
}

export async function translateTrendReportContent(
  base: TrendReport,
  targetLanguage: SupportedLanguage
): Promise<TrendReport | null> {
  const tags = ensureArray(base.tags);
  const content = ensureArray(base.content);
  const texts = [
    base.title,
    base.summary,
    base.details,
    base.neighborhood,
    ...tags,
    ...content
  ];

  const translated = await translateFields(texts, base.language, targetLanguage);
  if (!translated) return null;

  let index = 0;
  const title = translated[index++] ?? base.title;
  const summary = translated[index++] ?? base.summary;
  const details = translated[index++] ?? base.details;
  const neighborhood = translated[index++] ?? base.neighborhood;

  const translatedTags = tags.map((tag) => translated[index++] ?? tag);
  const translatedContent = content.map((paragraph) => {
    const next = translated[index++] ?? paragraph;
    return hasMediaHtml(paragraph) ? paragraph : next;
  });

  return {
    ...base,
    language: targetLanguage,
    title,
    summary,
    details,
    neighborhood,
    tags: translatedTags,
    content: translatedContent
  };
}

export async function translateEventContent(
  base: KCultureEvent,
  targetLanguage: SupportedLanguage
): Promise<KCultureEvent | null> {
  const longDescription = ensureArray(base.longDescription);
  const tips = ensureArray(base.tips);
  const texts = [
    base.title,
    base.description,
    base.location,
    base.price,
    ...longDescription,
    ...tips
  ];

  const translated = await translateFields(texts, base.language, targetLanguage);
  if (!translated) return null;

  let index = 0;
  const title = translated[index++] ?? base.title;
  const description = translated[index++] ?? base.description;
  const location = translated[index++] ?? base.location;
  const price = translated[index++] ?? base.price;
  const translatedLongDescription = longDescription.map((paragraph) => {
    const next = translated[index++] ?? paragraph;
    return hasMediaHtml(paragraph) ? paragraph : next;
  });
  const translatedTips = tips.map((tip) => translated[index++] ?? tip);

  return {
    ...base,
    language: targetLanguage,
    title,
    description,
    location,
    price,
    longDescription: translatedLongDescription,
    tips: translatedTips
  };
}

export async function translatePhraseContent(
  base: Phrase,
  targetLanguage: SupportedLanguage
): Promise<Phrase | null> {
  const texts = [base.translation, base.culturalNote ?? ""];
  const translated = await translateFields(texts, base.language, targetLanguage);
  if (!translated) return null;

  const [translationText, culturalNoteText] = translated;
  return {
    ...base,
    language: targetLanguage,
    translation: translationText ?? base.translation,
    culturalNote: culturalNoteText ?? base.culturalNote
  };
}

export async function translatePopupContent(
  base: PopupEvent,
  targetLanguage: SupportedLanguage
): Promise<PopupEvent | null> {
  const tags = ensureArray(base.tags);
  const highlights = ensureArray(base.highlights);
  const details = ensureArray(base.details);
  const texts = [
    base.title,
    base.brand,
    base.window,
    base.location,
    base.description,
    ...tags,
    ...highlights,
    ...details
  ];

  const translated = await translateFields(texts, base.language, targetLanguage);
  if (!translated) return null;

  let index = 0;
  const title = translated[index++] ?? base.title;
  const brand = translated[index++] ?? base.brand;
  const window = translated[index++] ?? base.window;
  const location = translated[index++] ?? base.location;
  const description = translated[index++] ?? base.description;

  const translatedTags = tags.map((tag) => translated[index++] ?? tag);
  const translatedHighlights = highlights.map((item) => translated[index++] ?? item);
  const translatedDetails = details.map((item) => {
    const next = translated[index++] ?? item;
    return hasMediaHtml(item) ? item : next;
  });

  return {
    ...base,
    language: targetLanguage,
    title,
    brand,
    window,
    location,
    description,
    tags: translatedTags,
    highlights: translatedHighlights,
    details: translatedDetails
  };
}
