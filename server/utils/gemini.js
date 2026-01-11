import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is not defined in environment variables!");
} else if (apiKey.length < 20) {
    console.warn("WARNING: GEMINI_API_KEY looks too short to be valid.");
}

const genAI = new GoogleGenerativeAI(apiKey || "dummy-key-to-prevent-crash");

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

export default model;