import { callOpenAI } from "../utils/openai.js";
import ProblemHistory from "../models/ProblemHistory.js";

/**
 * Extract the first valid JSON object from AI text
 */
const extractJSON = (text) => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return text.substring(start, end + 1);
  } catch {
    return null;
  }
};

/**
 * =========================
 * SOLVE CUSTOM PROBLEM
 * =========================
 */
export const solveProblem = async (req, res) => {
  let aiText = ""; // ✅ DECLARED ONCE

  try {
    const { problem, constraints } = req.body;

    if (!problem || problem.trim().length < 10) {
      return res.status(400).json({
        error: "Problem statement is too short or missing",
      });
    }

    const prompt = `
You are a competitive programming expert.

Problem:
${problem}

Constraints:
${constraints || "Not provided"}

Tasks:
1. Identify the optimal algorithm.
2. Structure the approach into clear, concise steps (point by point).
3. Provide time complexity in one concise word (e.g., O(N), O(NlogN), etc.).
4. Generate clean, commented solutions in C++, Java, JavaScript, and Python.

STRICT OUTPUT FORMAT (JSON ONLY):
{
  "approach": ["string", "string"],
  "complexity": "string",
  "solutions": {
    "cpp": "string",
    "java": "string",
    "javascript": "string",
    "python": "string"
  }
}

IMPORTANT:
- No markdown
- No explanations
- No text outside JSON
`;

    // 🔥 Call OpenAI
    aiText = await callOpenAI(prompt);

    const cleaned = extractJSON(aiText);
    if (!cleaned) {
      console.error("RAW AI OUTPUT:", aiText);
      return res.status(500).json({
        error: "AI response did not contain valid JSON",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON PARSE ERROR");
      console.error("CLEANED:", cleaned);
      return res.status(500).json({
        error: "AI returned malformed JSON",
      });
    }

    await ProblemHistory.create({
      user: req.user._id,
      title: problem.slice(0, 50) + "...",
      problemDescription: problem,
      constraints,
      approach: parsed.approach,
      complexity: parsed.complexity,
      solutions: parsed.solutions,
      type: "solve",
    });

    return res.json(parsed);
  } catch (error) {
    console.error("SOLVE AI ERROR:", error.message);

    if (aiText) {
      console.log("RAW AI TEXT (PARTIAL):", aiText.slice(0, 500));
    }

    if (
      error.message.includes("429") ||
      error.message.toLowerCase().includes("quota")
    ) {
      return res.status(429).json({
        error: "AI usage limit exceeded. Please wait and try again.",
      });
    }

    return res.status(500).json({
      error: "Failed to generate solution",
    });
  }
};

/**
 * =========================
 * SEARCH PROBLEM BY NAME
 * =========================
 */
export const searchProblemByName = async (req, res) => {
  let aiText = ""; // ✅ SAME FIX HERE

  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        error: "Problem name is too short",
      });
    }

    const prompt = `
You are a competitive programming assistant.

Search for the standard description and constraints for the problem:
"${name}"

STRICT OUTPUT FORMAT (JSON ONLY):
{
  "title": "string",
  "problem": "string",
  "constraints": "string",
  "difficulty": "Easy | Medium | Hard",
  "tags": ["string"]
}

IMPORTANT:
- Plain text only
- No markdown
- No explanations
- JSON only
`;

    // 🔥 Call OpenAI
    aiText = await callOpenAI(prompt);

    const cleaned = extractJSON(aiText);
    if (!cleaned) {
      console.error("RAW AI OUTPUT:", aiText);
      return res.status(500).json({
        error: "AI response did not contain valid JSON",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON PARSE ERROR");
      console.error("CLEANED:", cleaned);
      return res.status(500).json({
        error: "AI returned malformed JSON",
      });
    }

    await ProblemHistory.create({
      user: req.user._id,
      title: parsed.title,
      problemDescription: parsed.problem,
      constraints: parsed.constraints,
      type: "search",
    });

    return res.json(parsed);
  } catch (error) {
    console.error("SEARCH AI ERROR:", error.message);

    if (aiText) {
      console.log("RAW AI TEXT (PARTIAL):", aiText.slice(0, 500));
    }

    if (
      error.message.includes("429") ||
      error.message.toLowerCase().includes("quota")
    ) {
      return res.status(429).json({
        error: "AI usage limit exceeded. Please wait 1 minute.",
      });
    }

    return res.status(500).json({
      error: "Failed to find problem details",
    });
  }
};
