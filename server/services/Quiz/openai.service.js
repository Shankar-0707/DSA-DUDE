import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// utility function
const extractJSON = (text) => {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON object found in AI output");
    }
    return text.slice(firstBrace, lastBrace + 1);
};

export async function generateQuiz({ topic, level, count }) {
    const prompt = `
You are an automated exam-question generator for a high-stakes Data Structures assessment platform.

Topic: "${topic}"
Difficulty Level: "${level}"
Total Questions: ${count}

This is NOT a practice quiz.
This is a strictly difficulty-calibrated assessment.
Any question that feels easier than the specified level is INVALID.

========================
STRICT DIFFICULTY RULES
========================

The difficulty levels are STRICT and NON-OVERLAPPING.

BASIC:
- Terminology and definitions only
- Single-concept recognition
- No code
- No edge cases
- No reasoning

EASY:
- Simple understanding checks
- Direct application of one concept
- Small examples
- No tricky inputs
- No multi-step reasoning
- No code-output questions

MEDIUM:
- Concept application
- Small dry-runs
- Limited edge cases
- Short code logic questions
- No traps or hidden behavior

INTERMEDIATE:
- Multi-step reasoning required
- Non-obvious dry-runs
- Moderate edge cases
- Code-output prediction questions
- Shallow understanding must fail

HARD:
- Multiple interacting edge cases
- Algorithm selection under constraints
- Subtle logical pitfalls
- Invariant-based reasoning
- Code where behavior is not obvious
- Memorization-based questions are forbidden

EXPERT:
- ABSOLUTELY NO definitions or recall questions
- Elimination-round interview difficulty
- Deep invariant-based reasoning
- Amortized analysis when applicable
- Tricky code-output or bug-identification questions
- Case-study or scenario-based reasoning
- Assume the learner knows all standard algorithms

EXPERT QUESTION MIX (MANDATORY):
- 40% deep conceptual / invariant reasoning
- 40% code-based (output, bug, complexity)
- 20% scenario or case-study based

If even ONE question belongs to a lower level, the output is WRONG.

========================
CODE FORMATTING RULES
========================

If a question includes code:
- Code MUST be written line-by-line
- Each line on a new line
- Preserve indentation using spaces
- Code must be plain text
- DO NOT use markdown
- DO NOT use code blocks, backticks, or formatting syntax
- Code must appear directly inside the question text
If a question contains code, you MUST insert line breaks using newline characters (\\n) so that the code appears on separate lines in the JSON string.


Correct example:

The following code is executed:

int firstOccurrence(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return left;
}

What is the potential issue when the target is not present in the array?

Incorrect:
- Code written in a paragraph
- Code wrapped in markdown
- Inline backtick code

========================
GLOBAL OUTPUT RULES
========================

- Exactly 4 options per question
- Only ONE correct answer
- Options must be close and misleading
- No obvious eliminations

- No markdown
- No headings
- No backticks
- Return ONLY valid JSON

========================
OUTPUT FORMAT
========================


{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "string"
    }
  ]
}

`;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            const response = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a backend API. Return ONLY valid raw JSON matching the given schema. No markdown, no backticks, no extra text."
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                response_format: { type: "json_object" },
                max_tokens: 3000,
            });

            const rawOutput = response.choices[0].message.content;
            let cleanJSON;
            try {
                cleanJSON = extractJSON(rawOutput);
                const data = JSON.parse(cleanJSON);

                if (!data.questions || !Array.isArray(data.questions)) {
                    throw new Error("Invalid format: questions array missing");
                }

                data.questions.forEach((q, i) => {
                    if (
                        typeof q.question !== "string" ||
                        !Array.isArray(q.options) ||
                        q.options.length !== 4 ||
                        !q.options.includes(q.correctAnswer) ||
                        typeof q.explanation !== "string"
                    ) {
                        throw new Error(`Invalid question at index ${i}`);
                    }
                });

                return data;
            } catch (parseErr) {
                console.error("Failed to parse AI output. Raw output start:", rawOutput.substring(0, 100));
                throw parseErr;
            }

        } catch (err) {
            console.error(`Attempt ${attempts} failed to generate quiz:`, err.message);
            if (attempts === maxAttempts) {
                throw new Error("Failed to generate a valid quiz after multiple attempts.");
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
