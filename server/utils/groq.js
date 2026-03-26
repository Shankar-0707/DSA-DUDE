import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function callGroq(prompt, jsonMode = true) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: jsonMode
          ? "You are an expert AI assistant. Always respond with valid JSON only. No markdown, no code blocks, no backticks, no extra text — pure JSON."
          : "You are a helpful expert AI assistant. Respond clearly and concisely in plain text.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 4000,
  });
  return response.choices[0].message.content;
}
