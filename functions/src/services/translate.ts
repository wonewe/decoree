import OpenAI from "openai";
import { BaseEvent, SupportedLanguage } from "../types/event";

interface TranslatedFields {
  title: string;
  description: string;
  longDescription: string[];
  tips: string[];
}

export const translateEvent = async (
  event: BaseEvent,
  targetLangs: SupportedLanguage[]
): Promise<Record<SupportedLanguage, TranslatedFields>> => {
  const results: Record<SupportedLanguage, TranslatedFields> = {} as any;

  // If no API key, return original text for all languages (mock mode or error)
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not found. Skipping translation.");
    targetLangs.forEach((lang) => {
      results[lang] = {
        title: event.title,
        description: event.description,
        longDescription: event.longDescription,
        tips: event.tips,
      };
    });
    return results;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  for (const lang of targetLangs) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // or gpt-3.5-turbo
        messages: [
          {
            role: "system",
            content: `You are a professional translator for K-Culture events. 
            Translate the following JSON fields (title, description, longDescription, tips) into ${lang}.
            Rules:
            1. Maintain context and cultural nuances.
            2. If text is long, translate by paragraph.
            3. DO NOT translate prices (KRW), dates, or specific place names unless there is a standard official translation.
            4. Keep official English titles if available for ${lang === "en" ? "title" : "reference"}.
            5. longDescription is an array of paragraphs - keep it as an array.
            6. tips is an array of helpful information - keep it as an array.
            7. Return ONLY valid JSON format: {"title": "...", "description": "...", "longDescription": ["...", "..."], "tips": ["...", "..."]}`,
          },
          {
            role: "user",
            content: JSON.stringify({
              title: event.title,
              description: event.description,
              longDescription: event.longDescription,
              tips: event.tips,
            }),
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;
      if (content) {
        results[lang] = JSON.parse(content) as TranslatedFields;
      } else {
        throw new Error("Empty response from GPT");
      }
    } catch (error) {
      console.error(`Translation failed for ${lang}:`, error);
      // Fallback to original
      results[lang] = {
        title: event.title,
        description: event.description,
        longDescription: event.longDescription,
        tips: event.tips,
      };
    }
  }

  return results;
};
