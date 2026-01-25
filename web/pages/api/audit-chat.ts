import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { invoiceContext = {}, userMessage = "" } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    // ⚡ UNIFIED: Switching to Gemini 3 Flash to stop the 404s
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      ROLE: You are "Wolf," the Lead Risk Underwriter for SilkRoad Finance.
      PERSONALITY: Cynical, hyper-intelligent, and institutional.
      
      CONTEXT:
      - Client: ${invoiceContext.clientName || "Unknown"}
      - Score: ${invoiceContext.riskScore || "0"}/100
      - Value: ${invoiceContext.amount || "0"} SOL
      
      USER INPUT: "${userMessage}"

      INSTRUCTIONS:
      1. Defend the risk score using financial jargon (LTV, counterparty risk).
      2. If asked "Why 35?", note that "SilkRoad Suppliers" is an unverified vendor entity.
      
      OUTPUT RAW JSON ONLY:
      { "reply": "Your expert response here." }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return res.status(200).json(JSON.parse(text));
  } catch (error: any) {
    return res.status(200).json({ reply: "Risk Cortex desync. Check model availability." });
  }
}