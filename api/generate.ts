import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Add CORS headers for Vercel just in case
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: missing GEMINI_API_KEY' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      請生成 12 個關於「${category}」的基礎越南語單字。
      請特別針對「南越口音 (Southern Vietnamese)」提供發音指南（可以使用注音或中文諧音輔助說明南越特有的發音，例如 v 發 y 音，d/gi 發 y 音，r 發 r 或 g 音等）。
      每個單字必須包含一個實用的越南語例句及其中文翻譯。
      
      請以 JSON 陣列格式回傳，包含以下欄位：
      - vietnamese: 越南語單字
      - chinese: 繁體中文翻譯
      - pronunciation: 南越口音發音指南 (例如: "d 發 y 音，讀作...")
      - example_vn: 越南語例句
      - example_zh: 例句的繁體中文翻譯
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              vietnamese: { type: Type.STRING },
              chinese: { type: Type.STRING },
              pronunciation: { type: Type.STRING },
              example_vn: { type: Type.STRING },
              example_zh: { type: Type.STRING },
            },
            required: ["vietnamese", "chinese", "pronunciation", "example_vn", "example_zh"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(200).json([]);
    }
    return res.status(200).json(JSON.parse(text));
  } catch (error: any) {
    console.error("Vercel Serverless Function Error:", error);
    return res.status(500).json({ error: error.message || 'Error generating content' });
  }
}
