import { callGroq } from "../../utils/groq.js";

export const generateSummary = async (text) => {
    const prompt = `You are an expert document analyst.

Create a concise, clear, and professional summary of the document text below.
- Capture all main ideas and important insights
- Use simple language
- Keep the tone neutral and professional
- Do not add information not present in the original text

Document Text:
---
${text.slice(0, 8000)}
---

Respond with plain text summary only, no JSON.`;

    const response = await callGroq(prompt, false);
    return response.trim();
};

export const answerQuestion = async (context, question) => {
    const prompt = `You are a precise question-answering assistant.

Answer the QUESTION using ONLY the information in the CONTEXT below.
If the answer is not in the context, say: "The provided context does not contain enough information to answer this question."

CONTEXT:
---
${context.slice(0, 8000)}
---

QUESTION: ${question}

Respond with a plain text answer only, no JSON.`;

    const response = await callGroq(prompt, false);
    return response.trim();
};
