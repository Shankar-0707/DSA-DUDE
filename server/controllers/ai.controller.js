import model from "../utils/gemini.js";
import ProblemHistory from "../models/ProblemHistory.js";

const extractJSON = (text) => {
    try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start === -1 || end === -1) return text;
        return text.substring(start, end + 1);
    } catch (e) {
        return text;
    }
};

export const solveProblem = async (req, res) => {
    let result;
    try {
        const { problem, constraints } = req.body;

        if (!problem || problem.trim().length < 10) {
            return res.status(400).json({
                error: "problem is too short or missing"
            })
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
3. Provide time complexity in one concise word (e.g., O(NlogN), O(N^2), etc.).
4. Generate clean, commented solutions in C++, Java, JavaScript, and Python.

STRICT OUTPUT FORMAT (JSON ONLY):
{
  "approach": ["string", "string", ...],
  "complexity": "string (single concise word)",
  "solutions": {
    "cpp": "string",
    "java": "string",
    "javascript": "string",
    "python": "string"
  }
}

IMPORTANT: DO NOT include any conversational text, explanations or markdown blocks before or after the JSON. Return ONLY the JSON object.
`;

        result = await model.generateContent(prompt);
        const text = result.response.text();

        // ⚠️ Gemini sometimes adds markdown or filler, extract only JSON
        const cleaned = extractJSON(text);

        const parsed = JSON.parse(cleaned);

        // Save to History
        await ProblemHistory.create({
            user: req.user._id,
            title: problem.substring(0, 50) + "...", // Use snippet as title for custom problems
            problemDescription: problem,
            constraints: constraints,
            approach: parsed.approach,
            complexity: parsed.complexity,
            solutions: parsed.solutions,
            type: "solve"
        });

        return res.json(parsed);
    } catch (error) {
        console.error("Ai Error:", error.message);
        // Log the first 500 characters of the raw response to help debug malformations
        const rawText = result?.response?.text() || "No response text";
        console.log("Raw Response Snippet:", rawText.substring(0, 500));

        return res.status(500).json({
            error: "Failed to generate solution - AI returned malformed data"
        });
    }
}

export const searchProblemByName = async (req, res) => {
    let result;
    try {
        const { name } = req.body;

        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                error: "Problem name is too short"
            });
        }

        const prompt = `
You are a competitive programming assistant.
Search for the standard description and constraints for the problem: "${name}"

STRICT OUTPUT FORMAT (JSON ONLY):
{
  "title": "string",
  "problem": "string (plain text, no markdown backticks or bolding)",
  "constraints": "string (plain text)",
  "difficulty": "Easy/Medium/Hard",
  "tags": ["string"]
}

IMPORTANT: DO NOT include any conversational text, explanations or markdown blocks before or after the JSON. Return ONLY the JSON object.
`;

        result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = extractJSON(text);
        const parsed = JSON.parse(cleaned);

        // Save to History
        await ProblemHistory.create({
            user: req.user._id,
            title: parsed.title,
            problemDescription: parsed.problem,
            constraints: parsed.constraints,
            type: "search"
        });

        return res.json(parsed);
    } catch (error) {
        console.error("AI Search Error:", error.message);


        const rawText = result?.response?.text() || "No response text";
        console.log("Raw Search Snippet:", rawText.substring(0, 500));
        return res.status(500).json({
            error: "Failed to find problem details",
            details: error.message,
            rawText: result?.response?.text() || "No response text available",
            stack: error.stack
        });
    }
}