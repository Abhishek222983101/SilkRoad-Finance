export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing API Key' });
  
    try {
      const { transcript } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log("🎤 Processing:", transcript);
  
      // FIX: Using 'gemini-flash-latest' (Higher rate limits)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  
      const payload = {
        contents: [{ parts: [{ text: 
          `Extract JSON from command: "${transcript}". 
           Format: { "clientName": "String", "amount": "Number", "action": "MINT" }. 
           Return ONLY JSON.` 
        }] }]
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (response.status === 429) {
        throw new Error("Quota Exceeded (429). Please wait 30 seconds.");
      }
  
      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Google API Error:", errText);
        throw new Error(`API Error: ${response.status}`);
      }
  
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return res.status(200).json(JSON.parse(cleanJson));
  
    } catch (error: any) {
      console.error("❌ Crash:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }