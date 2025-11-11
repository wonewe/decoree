import type { SupportedLanguage } from "../../shared/i18n";

const GOOGLE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";

const translationCache = new Map<string, string>();

const languageToGoogleCode: Record<SupportedLanguage, string> = {
  en: "en",
  fr: "fr",
  ko: "ko",
  ja: "ja"
};

const buildCacheKey = (text: string, source?: string, target?: string) =>
  `${source ?? "auto"}|${target ?? "auto"}|${text}`;

type TranslateTextParams = {
  text: string;
  sourceLanguage?: SupportedLanguage;
  targetLanguage: SupportedLanguage;
};

export async function translateText({
  text,
  sourceLanguage,
  targetLanguage
}: TranslateTextParams): Promise<string> {
  const trimmed = text ?? "";
  if (!trimmed.trim()) return trimmed;
  if (!targetLanguage) return trimmed;
  if (sourceLanguage && sourceLanguage === targetLanguage) return trimmed;

  const targetCode = languageToGoogleCode[targetLanguage];
  const sourceCode = sourceLanguage ? languageToGoogleCode[sourceLanguage] : "auto";
  if (!targetCode) return trimmed;

  const cacheKey = buildCacheKey(trimmed, sourceCode, targetCode);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const params = new URLSearchParams({
    client: "gtx",
    sl: sourceCode ?? "auto",
    tl: targetCode,
    dt: "t",
    q: trimmed
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
        : trimmed;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    console.warn("Translation request failed", error);
    return trimmed;
  }
}

export type TranslationBatchResult = {
  values: string[];
  hasChanged: boolean;
};

export async function translateBatch(
  texts: string[],
  sourceLanguage: SupportedLanguage | undefined,
  targetLanguage: SupportedLanguage
): Promise<TranslationBatchResult> {
  if (!texts.length) {
    return { values: [], hasChanged: false };
  }

  if (!targetLanguage || sourceLanguage === targetLanguage) {
    return { values: [...texts], hasChanged: false };
  }

  const values = await Promise.all(
    texts.map((text) => translateText({ text, sourceLanguage, targetLanguage }))
  );
  const hasChanged = values.some((value, index) => value !== texts[index]);
  return { values, hasChanged };
}
