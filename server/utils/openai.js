import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing. Server cannot start.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generic AI call function
 */
export async function callOpenAI(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // 🔥 best balance (fast + cheap)
    messages: [
      {
        role: "system",
        content:
          "You are a strict competitive programming assistant. Always return valid JSON when asked.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2, // low randomness = stable JSON
  });

  return response.choices[0].message.content;
}
