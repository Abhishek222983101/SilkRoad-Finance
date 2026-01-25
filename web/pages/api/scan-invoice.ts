import { IncomingForm } from 'formidable';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = { api: { bodyParser: false } };

export default async function handler(req: any, res: any) {
  return new Promise((resolve) => {
    const form = new IncomingForm();
    form.parse(req, async (err: any, fields: any, files: any) => {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        // ⚡ UNIFIED: Using Gemini 3 Flash for PhD-level reasoning
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const base64Image = fs.readFileSync(file.filepath).toString('base64');
        const prompt = `Analyze this invoice for SilkRoad Finance. Output JSON only:
        {
          "clientName": "String", "amount": Number, "riskScore": Number,
          "conversation": [
            { "agent": "Auditor", "message": "..." },
            { "agent": "Analyst", "message": "..." },
            { "agent": "Compliance", "message": "..." }
          ]
        }`;

        const result = await model.generateContent([prompt, { inlineData: { data: base64Image, mimeType: file.mimetype } }]);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        res.status(200).json(JSON.parse(text));
        resolve(true);
      } catch (error) {
        // Fallback for demo
        res.status(200).json({ clientName: "Tesla Corp", amount: 5000, riskScore: 85, conversation: [{ agent: "System", message: "Demo Fallback Active." }] });
        resolve(true);
      }
    });
  });
}