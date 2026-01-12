import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const aiValidateProblem = async (problem, constraints, code) => {
    const prompt = `
You are a DSA expert. Validate the following code for the given problem and constraints.

Rules:
- Language: C++ (primarily, but be flexible if code is clear)
- Identify if the logic is correct for the problem described.
- Output JSON only.

Respond format:
{
  "isCorrect": boolean,
  "reason": "Explain why it's correct or what is wrong",
  "correctedCode": "Provide well-formatted, indented, and multi-line corrected code if isCorrect is false. Use the same formatting as the user's input, otherwise null.",
  "problemType": "e.g., array, string, tree, graph, etc.",
  "complexity": { "time": "O(n)", "space": "O(1)" },
  "suggestedInput": "A representative JSON string for test input, e.g., '[5, 2, 9, 1]'"
}

Problem:
${problem}

Constraints:
${constraints}

Code:
${code}
`;

    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    return JSON.parse(res.choices[0].message.content);
}




export const aiGenerateTrace = async (code, input, problemType) => {
    const prompt = `
Generate a step-by-step execution trace for the following code and input.

Rules:
- The trace should be suitable for visual representation.
- For arrays, include the current index and modified values.
- For other structures, represent state changes clearly.
- Output EXACT JSON.

Schema:
{
  "meta": { "problemType": "${problemType || 'array'}", "activeStructure": "e.g., array, pointers, etc." },
  "input": ${JSON.stringify(input)},
  "steps": [
    { 
      "explanation": "What happened in this step?",
      "state": { 
        "i": number, 
        "j": number, 
        "currentValue": any,
        "resultState": any // The state of the main data structure at this step
      }
    }
  ]
}

Input: ${JSON.stringify(input)}
Code:
${code}
`;

    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    return JSON.parse(res.choices[0].message.content);
}


