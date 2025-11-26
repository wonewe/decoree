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
const pickTranslated = (value: string | undefined, fallback: string) => {
  if (value == null) return fallback;
  if (value.trim() === "") return fallback;
  return value;
};

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
  const title = pickTranslated(translated[index++], base.title);
  const summary = pickTranslated(translated[index++], base.summary);
  const details = pickTranslated(translated[index++], base.details);
  const neighborhood = pickTranslated(translated[index++], base.neighborhood);

  const translatedTags = tags.map((tag) => pickTranslated(translated[index++], tag));
  const translatedContent = content.map((paragraph) => {
    const next = pickTranslated(translated[index++], paragraph);
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
  const title = pickTranslated(translated[index++], base.title);
  const description = pickTranslated(translated[index++], base.description);
  const location = pickTranslated(translated[index++], base.location);
  const price = pickTranslated(translated[index++], base.price);
  const translatedLongDescription = longDescription.map((paragraph) => {
    const next = pickTranslated(translated[index++], paragraph);
    return hasMediaHtml(paragraph) ? paragraph : next;
  });
  const translatedTips = tips.map((tip) => pickTranslated(translated[index++], tip));

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
    translation: pickTranslated(translationText, base.translation),
    culturalNote: pickTranslated(culturalNoteText, base.culturalNote ?? "")
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
  const title = pickTranslated(translated[index++], base.title);
  const brand = pickTranslated(translated[index++], base.brand);
  const window = pickTranslated(translated[index++], base.window);
  const location = pickTranslated(translated[index++], base.location);
  const description = pickTranslated(translated[index++], base.description);

  const translatedTags = tags.map((tag) => pickTranslated(translated[index++], tag));
  const translatedHighlights = highlights.map((item) => pickTranslated(translated[index++], item));
  const translatedDetails = details.map((item) => {
    const next = pickTranslated(translated[index++], item);
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
