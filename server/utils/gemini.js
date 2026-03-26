const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY missing — Gemini calls will fail");
}

const MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

export async function callGemini(prompt) {
  let lastError;

  for (const model of MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }

    const errText = await response.text();
    let status;
    try {
      status = JSON.parse(errText)?.error?.code;
    } catch {
      status = response.status;
    }

    // If quota exceeded, try next model
    if (status === 429) {
      console.warn(`Model ${model} quota exceeded, trying next...`);
      lastError = new Error(errText);
      continue;
    }

    throw new Error(errText);
  }

  throw lastError || new Error("All Gemini models quota exceeded");
}
