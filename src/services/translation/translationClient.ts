import type { SupportedLanguage } from "../../shared/i18n";

const GOOGLE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";
const TRANSLATION_PROXY_URL = import.meta.env.VITE_TRANSLATION_PROXY_URL;
const OPENAI_MODEL = "gpt-4o-mini";

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

  // Prefer proxy translation (server-side key) if configured
  if (TRANSLATION_PROXY_URL) {
    try {
      const translated = await translateViaProxy(trimmed, sourceLanguage, targetLanguage);
      translationCache.set(cacheKey, translated);
      return translated;
    } catch (error) {
      console.warn("Proxy translation failed, falling back to Google:", error);
    }
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

async function translateWithGPT(
  text: string,
  sourceLanguage: SupportedLanguage | undefined,
  targetLanguage: SupportedLanguage
): Promise<string> {
  throw new Error("Client-side GPT translation is disabled for security.");
}

<<<<<<< HEAD
  const body = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a professional translator. Return only the translated text without quotes or extra commentary."
      },
      {
        role: "user",
        content: `Translate this text${sourceLanguage ? ` from ${sourceLanguage}` : ""} to ${targetLanguage}:\n${text}`
      }
    ],
    temperature: 0.2,
    max_tokens: Math.min(2048, Math.max(64, Math.ceil(text.length * 1.5)))
  };

  const response = await fetch(OPENAI_COMPLETIONS_URL, {
=======
async function translateViaProxy(
  text: string,
  sourceLanguage: SupportedLanguage | undefined,
  targetLanguage: SupportedLanguage
): Promise<string> {
  const response = await fetch(TRANSLATION_PROXY_URL!, {
>>>>>>> 037e63a (fix api key)
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      text,
      sourceLanguage,
      targetLanguage
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Proxy translate failed (${response.status}): ${message}`);
  }

  const payload = await response.json();
  const translated =
    typeof payload?.translated === "string" && payload.translated.trim()
      ? payload.translated.trim()
      : null;

  if (!translated) {
    throw new Error("Proxy translate missing translated field");
  }

  return translated;
}
