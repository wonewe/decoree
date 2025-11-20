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
      // Check if content needs to be generated
      const needsGeneration =
        event.description.length < 50 ||
        event.longDescription.length === 0 ||
        event.longDescription[0] === "공연 상세 정보가 제공되지 않습니다." ||
        event.tips.length === 0;

      const systemPrompt = needsGeneration
        ? `You are a professional K-Culture event content creator and translator.
The event data may be incomplete. For missing or insufficient content, GENERATE compelling content in ${lang} based on the event information provided (title, category, location, dates, price).

Rules:
1. If description is too short (< 50 chars), generate a compelling 2-3 sentence description.
2. If longDescription is empty or generic, create 3-5 informative paragraphs about:
   - What makes this event special/unique
   - What attendees can expect
   - The venue/atmosphere
   - Why it's worth attending
3. If tips is empty, create 3-5 helpful tips for attendees (e.g., parking, nearby food, what to bring, best seats, etc.)
4. Translate and enhance existing content if provided.
5. Be creative but realistic - use typical K-Culture event conventions.
6. DO NOT translate prices (KRW), dates, or place names.
7. Return ONLY valid JSON: {"title": "...", "description": "...", "longDescription": ["...", "..."], "tips": ["...", "..."]}`
        : `You are a professional translator for K-Culture events.
Translate the following JSON fields into ${lang}.

Rules:
1. Maintain context and cultural nuances.
2. DO NOT translate prices (KRW), dates, or specific place names.
3. Keep official English titles if available for ${lang === "en" ? "title" : "reference"}.
4. Return ONLY valid JSON: {"title": "...", "description": "...", "longDescription": ["...", "..."], "tips": ["...", "..."]}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: JSON.stringify({
              // Provide all event context for generation
              title: event.title,
              category: event.category,
              location: event.location,
              startDate: event.startDate,
              endDate: event.endDate,
              time: event.time,
              price: event.price,
              // Current content (may be incomplete)
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
