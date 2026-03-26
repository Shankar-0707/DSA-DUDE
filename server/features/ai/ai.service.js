import { callGroq } from "../../utils/groq.js";

const extractJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON found in AI response");
    return JSON.parse(text.substring(start, end + 1));
  }
};

export const aiValidateProblem = async (problem, constraints, code) => {
  const prompt = `You are a DSA expert. Validate the following C++ code for the given problem.

Problem: ${problem}
Constraints: ${constraints}
Code:
${code}

Return ONLY valid JSON, no markdown, no backticks:
{
  "isCorrect": true,
  "reason": "explanation of correctness or what is wrong",
  "correctedCode": null,
  "problemType": "array",
  "complexity": { "time": "O(n)", "space": "O(1)" },
  "suggestedInput": "[1, 2, 3, 4, 5]"
}

Rules:
- If code is correct, set isCorrect to true and correctedCode to null
- If code is wrong, set isCorrect to false and provide correctedCode with proper newlines using \\n
- suggestedInput must be a valid JSON array string`;

  const text = await callGroq(prompt);
  return extractJSON(text);
};

export const aiGenerateTrace = async (code, input, problemType) => {
  const prompt = `Generate a step-by-step execution trace for this code and input.

Problem type: ${problemType || "array"}
Input: ${JSON.stringify(input)}
Code:
${code}

Return ONLY valid JSON, no markdown, no backticks:
{
  "meta": { "problemType": "array", "activeStructure": "array" },
  "input": ${JSON.stringify(input)},
  "steps": [
    {
      "explanation": "what happened in this step",
      "state": {
        "i": 0,
        "j": 0,
        "currentValue": 1,
        "resultState": [1, 2, 3]
      }
    }
  ]
}`;

  const text = await callGroq(prompt);
  return extractJSON(text);
};
