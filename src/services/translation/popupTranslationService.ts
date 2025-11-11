import type { PopupEvent } from "../../data/popups";
import type { SupportedLanguage } from "../../shared/i18n";
import { translateBatch } from "./translationClient";

const AUTO_TRANSLATE_POPUPS = import.meta.env.VITE_POPUP_AUTO_TRANSLATE === "true";
const popupCache = new Map<string, PopupEvent>();

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
  if (!AUTO_TRANSLATE_POPUPS) return null;
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

  const result = await translateBatch(texts, popup.language, targetLanguage);
  if (!result.hasChanged) return null;

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
