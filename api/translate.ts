import type { VercelRequest, VercelResponse } from "@vercel/node";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  const { text, sourceLanguage, targetLanguage, model } = req.body || {};
  if (!text || !targetLanguage) {
    return res.status(400).json({ error: "text and targetLanguage are required" });
  }

  const prompt = `Translate the following text${
    sourceLanguage ? ` from ${sourceLanguage}` : ""
  } to ${targetLanguage}. Return only the translated text.\n\n${text}`;

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        messages: [
          { role: "system", content: "You are a professional translator." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: Math.max(64, Math.min(2048, Math.ceil(String(text).length * 1.5)))
      })
    });

    if (!response.ok) {
      const message = await response.text();
      return res
        .status(response.status)
        .json({ error: `OpenAI error (${response.status})`, details: message });
    }

    const payload = await response.json();
    const translated = payload?.choices?.[0]?.message?.content?.trim();
    if (!translated) {
      return res.status(502).json({ error: "OpenAI returned no content" });
    }

    res.setHeader("Access-Control-Allow-Origin", "*"); // adjust to specific origin if needed
    return res.status(200).json({ translated });
  } catch (error) {
    console.error("Translate proxy failed", error);
    return res.status(500).json({ error: "Proxy translation failed" });
  }
}
