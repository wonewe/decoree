import type { PopupEvent } from "../../data/popups";
import type { SupportedLanguage } from "../../shared/i18n";

const AUTO_TRANSLATE_POPUPS = import.meta.env.VITE_POPUP_AUTO_TRANSLATE === "true";
const GOOGLE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";

const translationCache = new Map<string, string>();
const popupCache = new Map<string, PopupEvent>();

const languageToGoogleCode: Record<SupportedLanguage, string> = {
  en: "en",
  fr: "fr",
  ko: "ko",
  ja: "ja"
};

const buildCacheKey = (text: string, source?: string, target?: string) =>
  `${source ?? "auto"}|${target ?? "auto"}|${text}`;

async function translateText(
  text: string,
  sourceLanguage: SupportedLanguage | undefined,
  targetLanguage: SupportedLanguage
) {
  if (!AUTO_TRANSLATE_POPUPS) return text;
  if (!text?.trim()) return text;

  const targetCode = languageToGoogleCode[targetLanguage];
  if (!targetCode) return text;

  const sourceCode = sourceLanguage ? languageToGoogleCode[sourceLanguage] : "auto";
  const cacheKey = buildCacheKey(text, sourceCode, targetCode);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const params = new URLSearchParams({
    client: "gtx",
    sl: sourceCode ?? "auto",
    tl: targetCode,
    dt: "t",
    q: text
  });

  try {
    const response = await fetch(`${GOOGLE_ENDPOINT}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Translate request failed (${response.status})`);
    }
    const payload = await response.json();
    const translated =
      Array.isArray(payload?.[0]) && Array.isArray(payload[0][0])
        ? payload[0].map((segment: [string]) => segment[0]).join("")
        : text;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    console.warn("Popup translation failed", error);
    return text;
  }
}

type BatchTranslationResult = {
  values: string[];
  changed: boolean;
};

async function translateTexts(
  texts: string[],
  sourceLanguage: SupportedLanguage | undefined,
  targetLanguage: SupportedLanguage
): Promise<BatchTranslationResult | null> {
  if (!AUTO_TRANSLATE_POPUPS || texts.length === 0) {
    return null;
  }

  const translated = await Promise.all(
    texts.map((text) => translateText(text, sourceLanguage, targetLanguage))
  );
  const changed = translated.some((value, index) => value !== texts[index]);
  if (!changed) return null;
  return { values: translated, changed };
}

export function shouldAutoTranslatePopup(
  sourceLanguage: SupportedLanguage | undefined,
  targetLanguage: SupportedLanguage | undefined
) {
  if (!AUTO_TRANSLATE_POPUPS) return false;
  if (!sourceLanguage || !targetLanguage) return false;
  if (sourceLanguage === targetLanguage) return false;
  return sourceLanguage === "ko";
}

export async function translatePopupEvent(
  popup: PopupEvent,
  targetLanguage: SupportedLanguage
): Promise<PopupEvent | null> {
  const cacheKey = `${popup.id}:${targetLanguage}`;
  if (popupCache.has(cacheKey)) {
    return popupCache.get(cacheKey)!;
  }

  const texts = [
    popup.title,
    popup.brand,
    popup.location,
    popup.description,
    ...popup.tags,
    ...popup.highlights,
    ...popup.details
  ];

  const result = await translateTexts(texts, popup.language, targetLanguage);

  if (!result) {
    return null;
  }

  const { values } = result;
  let index = 0;

  const title = values[index++];
  const brand = values[index++];
  const location = values[index++];
  const description = values[index++];

  const tags = values.slice(index, index + popup.tags.length);
  index += popup.tags.length;

  const highlights = values.slice(index, index + popup.highlights.length);
  index += popup.highlights.length;

  const details = values.slice(index, index + popup.details.length);

  const translatedPopup: PopupEvent = {
    ...popup,
    title,
    brand,
    location,
    description,
    tags,
    highlights,
    details,
    language: targetLanguage
  };

  popupCache.set(cacheKey, translatedPopup);
  return translatedPopup;
}
