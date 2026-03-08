import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q, sl, tl } = req.query;

  if (!q || !tl) {
    return res.status(400).json({ error: "Missing required params: q, tl" });
  }

  const params = new URLSearchParams({
    client: "gtx",
    sl: (sl as string) || "auto",
    tl: tl as string,
    dt: "t",
    q: q as string,
  });

  try {
    const response = await fetch(GOOGLE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: "Translation API error" });
    }
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (err) {
    console.error("Translation proxy error:", err);
    return res.status(500).json({ error: "Translation proxy failed" });
  }
}
