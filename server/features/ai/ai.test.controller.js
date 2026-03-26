import OpenAI from "openai";

export const testAIConnection = async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello in one word" }],
      max_tokens: 10,
    });

    return res.json({
      success: true,
      message: "OpenAI connection working!",
      response: response.choices[0].message.content,
      model: response.model,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      status: error.status,
      hint: error.status === 401
        ? "Invalid API key"
        : error.status === 429
        ? "Quota exceeded or rate limited"
        : "Check OpenAI dashboard",
    });
  }
};
