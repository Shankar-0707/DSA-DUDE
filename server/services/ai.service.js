import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

 export const aiValidatePrefixSum = async (problem, constraints, code) => {
  const prompt = `
You are validating a PREFIX SUM ARRAY solution.

Rules:
- Only prefix sum logic allowed
- Language: C++
- Output JSON only

Respond format:
{
  "isCorrect": boolean,
  "reason": string,
  "correctedCode": string | null
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
    messages: [{ role: "user", content: prompt }]
  });

  return JSON.parse(res.choices[0].message.content);
}




export const aiTracePrefixSum = async (code, input) =>  {
  const prompt = `
Convert the following PREFIX SUM logic into step-by-step trace.

Rules:
- Do NOT explain
- Do NOT modify input
- Output EXACT JSON

Schema:
{
  "meta": { "problemType": "array", "pattern": "prefix_sum" },
  "input": number[],
  "steps": [
    { "i": number, "value": number, "prefixSum": number }
  ]
}

Input: ${JSON.stringify(input)}
Code:
${code}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return JSON.parse(res.choices[0].message.content);
}


