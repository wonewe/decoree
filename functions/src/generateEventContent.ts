import { onCall, HttpsError } from "firebase-functions/v2/https";
import OpenAI from "openai";

interface GenerateEventContentRequest {
  title: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  price?: string;
  language?: string;
  description?: string;
  longDescription?: string;
  tips?: string;
}

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const generateEventContent = onCall(
  { cors: true, timeoutSeconds: 120, memory: "1GiB" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "로그인한 사용자만 사용할 수 있습니다.");
    }

    if (!openaiClient) {
      throw new HttpsError("failed-precondition", "OpenAI API Key가 설정되지 않았습니다.");
    }

    const data = request.data as GenerateEventContentRequest;

    if (!data?.title || !data?.language) {
      throw new HttpsError(
        "invalid-argument",
        "title과 language는 필수입니다. 기본 정보가 부족하면 콘텐츠를 생성할 수 없습니다."
      );
    }

    try {
      const systemPrompt = `You are a bilingual K-culture editor who crafts compelling event descriptions.
Create localized content in ${data.language} using the provided metadata.

Rules:
1. description: 2-3 sentences summarizing the experience.
2. longDescription: array of 3-5 paragraphs (Markdown-compatible HTML <p> tags allowed) covering vibe, program highlights, venue, reasons to attend.
3. tips: array of 3-5 concise actionable suggestions (what to bring, best time, nearby spots, booking reminders, etc.)
4. Keep dates, prices, proper nouns (venues, brand names) exactly as provided.
5. Be truthful but fill gaps creatively if details are missing.
6. Return ONLY valid JSON {"description": "...", "longDescription": ["..."], "tips": ["..."]}.`;

      const userContent = {
        title: data.title,
        category: data.category,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        time: data.time,
        price: data.price,
        existingDescription: data.description,
        existingLongDescription: data.longDescription,
        existingTips: data.tips
      };

      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(userContent) }
        ],
        response_format: { type: "json_object" }
      });

      const normalizeArray = (value?: string[] | string) => {
        if (!value) return [];
        if (Array.isArray(value)) {
          return value.filter((item) => !!item?.trim());
        }
        return value.trim() ? [value.trim()] : [];
      };

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("OpenAI 응답이 비어 있습니다.");
      }

      let parsed: {
        description?: string;
        longDescription?: string[] | string;
        tips?: string[] | string;
      };

      try {
        parsed = JSON.parse(content);
      } catch (parseError) {
        console.error("Failed to parse OpenAI JSON response:", content, parseError);
        throw new HttpsError("internal", "AI가 유효하지 않은 형식의 콘텐츠를 반환했습니다.");
      }

      return {
        description: parsed.description ?? "",
        longDescription: normalizeArray(parsed.longDescription),
        tips: normalizeArray(parsed.tips)
      };
    } catch (error) {
      console.error("generateEventContent failed", error);
      throw new HttpsError("internal", "AI 콘텐츠 생성 중 오류가 발생했습니다.");
    }
  }
);

