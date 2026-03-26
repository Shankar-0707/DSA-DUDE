import { callGroq } from "../../utils/groq.js";
import ProblemHistory from "../../models/ProblemHistory.js";

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

/**
 * =========================
 * SOLVE CUSTOM PROBLEM
 * =========================
 */
export const solveProblem = async (req, res) => {
  try {
    const { problem, constraints } = req.body;

    if (!problem || problem.trim().length < 10) {
      return res.status(400).json({ error: "Problem statement is too short or missing" });
    }

    const prompt = `You are a competitive programming expert.

Problem: ${problem}
Constraints: ${constraints || "Not provided"}

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

    const aiText = await callGroq(prompt);
    const parsed = extractJSON(aiText);

    if (!parsed || !parsed.solutions) {
      return res.status(500).json({ error: "AI returned invalid response. Please try again." });
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
    }).catch(err => console.error("DB save error:", err.message));

    return res.json(parsed);

  } catch (error) {
    console.error("SOLVE ERROR:", error.message);
    return res.status(500).json({
      error: "AI service failed. Please check your OpenAI API key and billing.",
      details: error.message
    });
  }
};

/**
 * =========================
 * SEARCH PROBLEM BY NAME
 * =========================
 */
export const searchProblemByName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Problem name is too short" });
    }

    const prompt = `You are a competitive programming assistant.

Find the standard LeetCode/competitive programming problem named: "${name}"

Return ONLY this JSON (no markdown, no backticks, no extra text):
{
  "title": "exact problem title",
  "problem": "full problem description with examples",
  "constraints": "all constraints listed",
  "difficulty": "Easy",
  "tags": ["array", "binary-search"]
}`;

    const aiText = await callGroq(prompt);
    const parsed = extractJSON(aiText);

    if (!parsed || !parsed.problem) {
      return res.status(500).json({ error: "AI returned invalid response. Please try again." });
    }

    await ProblemHistory.create({
      user: req.user._id,
      title: parsed.title,
      problemDescription: parsed.problem,
      constraints: parsed.constraints,
      type: "search",
    }).catch(err => console.error("DB save error:", err.message));

    return res.json(parsed);

  } catch (error) {
    console.error("SEARCH ERROR:", error.message);
    return res.status(500).json({
      error: "AI service failed. Please check your OpenAI API key and billing.",
      details: error.message
    });
  }
};
