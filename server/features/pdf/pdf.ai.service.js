import {GoogleGenAI} from "@google/genai";  // googleai ki services ab GoogleGenAI me h yani ye google ai models ko access kr skta h 
import dotenv from "dotenv";

// hm yha dotenv isiliye import krre h taki APi key directly access ho ske
dotenv.config();

const ai = new GoogleGenAI({  // yha hm ek object create krre h jo ki hmare liye ai models se baat krega
    apiKey : process.env.GEMINI_API_KEY,
})
const model = "gemini-2.5-flash";  // mtlb hm ye model use krna chah rhe h 

/**
 * Generates a concise summary for a given text.
 * @param {string} text - The text to summarize.  function ko ek string type ka text milega
 */
export const generateSummary = async (text) => {
    const prompt = `You are an expert document analyst.

Task:
Create a concise, clear, and professional summary of the document text provided below.

Guidelines:
- Use simple and easy-to-understand language.
- Capture all main ideas and important insights.
- Highlight KEY TERMS and IMPORTANT CONCEPTS by writing them in ALL CAPITAL LETTERS (do not use symbols like *, **, or backtick).
- Present information in short paragraphs.
- Use numbered or bulleted points ONLY where listing improves clarity.
- Keep the tone neutral and professional.
- Do not add any information that is not present in the original text.

Document Text:
---
${text}
---
`

const response = await ai.models.generateContent({
    model : model,
    contents : [{role: 'user', parts : [{text : prompt}]}],
});

const text2 = response?.candidates?.[0]?.content?.parts?.[0]?.text;
return text2.trim() || '';

};

/**
 * Answers a question based on the provided document context.
 * @param {string} context - The document text to use as context.
 * @param {string} question - The user's question.
 */
export const answerQuestion = async (context, question) => {
    const prompt = `You are a precise and reliable question-answering assistant.

Task:
Answer the QUESTION using ONLY the information explicitly stated in the CONTEXT below.

Rules:
- Do not use any outside knowledge or assumptions.
- If the answer is not clearly found in the context, respond with:
  "The provided context does not contain enough information to answer this question."
- Keep the answer clear, concise, and professional.
- Use simple language.
- Highlight IMPORTANT TERMS by writing them in ALL CAPITAL LETTERS.
- Do NOT use markdown symbols, asterisks, or special formatting characters.
- Use short paragraphs or numbered points only when it improves clarity.
- Do not repeat the question in the answer.

CONTEXT:
---
${context}
---

QUESTION:
${question}
`

const response = await ai.models.generateContent({
    model : model,
    contents : [{ role: 'user', parts: [{ text: prompt }] }],
});

const text2 = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text2?.trim() || '';
}



