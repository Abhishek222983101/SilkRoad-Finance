const apiKey = process.env.GEMINI_API_KEY || "AIzaSyC3BP2_66IHVIcXrW5vvlrFuUo53n6vfco"; // Your key

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("✅ AVAILABLE MODELS FOR YOUR KEY:");
    if (data.models) {
        data.models.forEach((m: any) => console.log(` - ${m.name}`));
    } else {
        console.log("❌ No models found. Response:", data);
    }
  } catch (e) {
    console.error("❌ Network Error:", e);
  }
}

listModels();