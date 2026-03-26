import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Simple AI call function for debugging
 */
export async function callOpenAI(prompt, retries = 0) {
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }
  try {
    console.log("Making OpenAI API call...");
    console.log("API Key exists:", !!process.env.OPENAI_API_KEY);
    console.log("API Key length:", process.env.OPENAI_API_KEY?.length);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Always provide clear, accurate responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    console.log("OpenAI API call successful");
    return response.choices[0].message.content;
    
  } catch (error) {
    console.error("OpenAI API Error Details:");
    console.error("- Message:", error.message);
    console.error("- Status:", error.status);
    console.error("- Code:", error.code);
    console.error("- Type:", error.type);
    console.error("- Full error:", error);
    
    // Re-throw the error with more context
    const enhancedError = new Error(`OpenAI API Error: ${error.message}`);
    enhancedError.status = error.status;
    enhancedError.code = error.code;
    enhancedError.type = error.type;
    enhancedError.originalError = error;
    
    throw enhancedError;
  }
}
