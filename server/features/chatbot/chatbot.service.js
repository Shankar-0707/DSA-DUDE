// Chatbot service — functions implemented in later tasks
import { callGroq } from "../../utils/groq.js";
import { callGemini } from "../../utils/gemini.js";

const INJECTION_PATTERNS = [
  /ignore previous instructions/gi,
  /system:/gi,
  /you are now/gi,
  /disregard/gi,
  /forget your instructions/gi,
  /new instructions/gi,
  /override/gi,
  /act as/gi,
  /pretend you are/gi,
  /roleplay as/gi,
];

export const sanitizeMessage = (text) => {
  let sanitized = text;
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }
  return sanitized.trim();
};

export const VALID_INTENTS = [
  "fetch_approach",
  "search_problem",
  "start_quiz",
  "upload_pdf_prompt",
  "general_question",
  "unknown",
];

const buildClassificationPrompt = (message) => `You are an intent classifier for a DSA learning app chatbot.
Classify the user message into exactly one intent.

Valid intents:
- fetch_approach: user wants to get an algorithm approach/solution for a problem
- search_problem: user wants to find/look up a problem by name
- start_quiz: user wants to start or take a quiz
- upload_pdf_prompt: user is asking about PDFs, documents, or resume features
- general_question: general DSA/programming question or anything else
- unknown: completely unrelated or incomprehensible

Extract any relevant params:
- fetch_approach: { "problemName": "..." }
- search_problem: { "problemName": "..." }
- start_quiz: { "topic": "...", "level": "..." | null }
- others: {}

User message: "${message}"

Return ONLY valid JSON: { "intent": "...", "params": { ... } }`;

const parseIntentResponse = (text) => {
  // Strip markdown code blocks if present
  const cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  const intent = VALID_INTENTS.includes(parsed.intent) ? parsed.intent : "unknown";
  return { intent, params: parsed.params ?? {} };
};

export const detectIntent = async (message) => {
  const prompt = buildClassificationPrompt(message);

  try {
    const groqResponse = await callGroq(prompt, true);
    return parseIntentResponse(groqResponse);
  } catch {
    // Groq failed — try Gemini fallback
    try {
      const geminiResponse = await callGemini(prompt);
      return parseIntentResponse(geminiResponse);
    } catch {
      return { intent: "unknown", params: {} };
    }
  }
};

// ─── Private helper (copied from ai.controller.js) ───────────────────────────
const extractJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start === -1 || end === -1) return null;
      return JSON.parse(text.substring(start, end + 1));
    } catch {
      return null;
    }
  }
};

// ─── Valid quiz topics ────────────────────────────────────────────────────────
export const VALID_TOPICS = [
  "arrays",
  "linked-lists",
  "stacks",
  "queues",
  "trees",
  "graphs",
  "dynamic-programming",
  "sorting",
  "searching",
  "hashing",
];

// ─── 4.1 handleFetchApproach ──────────────────────────────────────────────────
export const handleFetchApproach = async (params, history) => {
  if (!params.problemName || !params.problemName.trim()) {
    return {
      type: "text",
      content: "What problem would you like me to fetch the approach for?",
      data: null,
    };
  }

  const problemName = params.problemName.trim();

  const prompt = `You are a competitive programming expert.

Problem: ${problemName}
Constraints: Not provided

Tasks:
1. Identify the optimal algorithm and explain the approach in clear steps.
2. Provide time complexity (e.g., O(N), O(NlogN)).
3. Write complete, working, properly indented solutions in C++, Java, JavaScript, and Python.
   IMPORTANT: In the JSON string values, use \\n for newlines and \\t for indentation.

Return ONLY valid JSON in this exact format:
{
  "approach": ["step 1", "step 2", "step 3"],
  "complexity": "O(N)",
  "solutions": {
    "cpp": "#include<bits/stdc++.h>\\nusing namespace std;\\nclass Solution {\\npublic:\\n    int solve() {\\n        return 0;\\n    }\\n};",
    "java": "class Solution {\\n    public int solve() {\\n        return 0;\\n    }\\n}",
    "javascript": "var solve = function() {\\n    return 0;\\n};",
    "python": "class Solution:\\n    def solve(self):\\n        return 0"
  }
}

Follow the exact same \\n pattern shown above for ALL code. No markdown fences.`;

  try {
    const aiText = await callGroq(prompt);
    const parsed = extractJSON(aiText);

    if (!parsed || !parsed.solutions) {
      return {
        type: "text",
        content: "Sorry, I couldn't fetch the approach for that problem. Please try again.",
        data: null,
      };
    }

    return {
      type: "approach",
      content: `Here's the approach for ${problemName}`,
      data: {
        title: problemName,
        approach: parsed.approach,
        complexity: parsed.complexity,
        solutions: parsed.solutions,
      },
    };
  } catch {
    return {
      type: "text",
      content: "Sorry, I couldn't fetch the approach for that problem. Please try again.",
      data: null,
    };
  }
};

// ─── 4.3 handleSearchProblem ──────────────────────────────────────────────────
export const handleSearchProblem = async (params, history) => {
  if (!params.problemName || !params.problemName.trim()) {
    return {
      type: "text",
      content: "What problem would you like me to search for?",
      data: null,
    };
  }

  const problemName = params.problemName.trim();

  const prompt = `You are a competitive programming assistant.

Find the standard LeetCode/competitive programming problem named: "${problemName}"

Return ONLY this JSON (no markdown, no backticks, no extra text):
{
  "title": "exact problem title",
  "problem": "full problem description with examples",
  "constraints": "all constraints listed",
  "difficulty": "Easy",
  "tags": ["array", "binary-search"]
}`;

  try {
    const aiText = await callGroq(prompt);
    const parsed = extractJSON(aiText);

    if (!parsed || !parsed.problem) {
      return {
        type: "text",
        content: "I couldn't find that problem. Try rephrasing the name.",
        data: null,
      };
    }

    return {
      type: "problem",
      content: `Here's what I found for ${parsed.title || problemName}`,
      data: {
        title: parsed.title,
        problem: parsed.problem,
        constraints: parsed.constraints,
        difficulty: parsed.difficulty,
        tags: parsed.tags,
      },
    };
  } catch {
    return {
      type: "text",
      content: "I couldn't find that problem. Try rephrasing the name.",
      data: null,
    };
  }
};

// ─── 4.5 handleStartQuiz ─────────────────────────────────────────────────────
export const handleStartQuiz = (params) => {
  const rawTopic = (params.topic || "").trim().toLowerCase();
  const matchedTopic = VALID_TOPICS.find((t) => t === rawTopic);

  if (!matchedTopic) {
    return {
      type: "text",
      content:
        "I don't recognize that topic. Available topics: arrays, linked-lists, stacks, queues, trees, graphs, dynamic-programming, sorting, searching, hashing",
      data: null,
    };
  }

  const level = params.level ? params.level.trim().toLowerCase() : null;
  const url = level ? `/quiz/${matchedTopic}/${level}` : `/quiz/${matchedTopic}`;

  return {
    type: "quiz",
    content: `Ready to start a quiz on ${matchedTopic}!`,
    data: {
      topic: matchedTopic,
      levels: ["easy", "medium", "hard"],
      url,
    },
  };
};

// ─── 4.7 handlePdfPrompt ─────────────────────────────────────────────────────
export const handlePdfPrompt = () => ({
  type: "pdf_link",
  content:
    "You can upload and analyze PDFs in the Documents section. Click below to go there!",
  data: null,
});

// ─── 4.8 handleGeneralQuestion ───────────────────────────────────────────────
export const handleGeneralQuestion = async (message, history) => {
  const historyContext = (history || [])
    .map((m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
    .join("\n");

  const prompt = `You are a helpful DSA and programming tutor. Answer the following question clearly and concisely.
Previous conversation:
${historyContext}

User: ${message}`;

  try {
    const responseText = await callGroq(prompt, false);
    return { type: "text", content: responseText, data: null };
  } catch {
    try {
      const responseText = await callGemini(prompt);
      return { type: "text", content: responseText, data: null };
    } catch {
      return {
        type: "text",
        content: "Sorry, I'm having trouble answering right now. Please try again.",
        data: null,
      };
    }
  }
};

// ─── 5.1 processMessage ──────────────────────────────────────────────────────
export const processMessage = async (userId, message, history) => {
  const { intent, params } = await detectIntent(message);

  switch (intent) {
    case "fetch_approach":
      return handleFetchApproach(params, history);
    case "search_problem":
      return handleSearchProblem(params, history);
    case "start_quiz":
      return handleStartQuiz(params);
    case "upload_pdf_prompt":
      return handlePdfPrompt();
    case "general_question":
    case "unknown":
    default:
      return handleGeneralQuestion(message, history);
  }
};
