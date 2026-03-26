import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// utility function
const extractJSON = (text) => {
    try {
        // First try to parse the entire text as JSON
        return JSON.parse(text);
    } catch {
        // If that fails, try to extract JSON from the text
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No JSON object found in AI output");
        }
        const jsonStr = text.slice(firstBrace, lastBrace + 1);
        return JSON.parse(jsonStr);
    }
};

// Function to process and clean question text
const processQuestionText = (text) => {
    if (!text) return text;
    
    // Replace escaped newlines with actual newlines for better rendering
    return text.replace(/\\n/g, '\n');
};

// Function to validate and clean quiz data
const validateAndCleanQuizData = (data) => {
    if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid format: questions array missing");
    }

    console.log(`Validating ${data.questions.length} questions`);

    // Check for duplicate questions
    const questionTexts = new Set();
    const duplicates = [];

    data.questions.forEach((q, i) => {
        if (
            typeof q.question !== "string" ||
            !Array.isArray(q.options) ||
            q.options.length !== 4 ||
            !q.options.includes(q.correctAnswer) ||
            typeof q.explanation !== "string"
        ) {
            console.error(`Invalid question at index ${i}:`, q);
            throw new Error(`Invalid question at index ${i}`);
        }
        
        // Check for duplicates
        const questionKey = q.question.toLowerCase().trim();
        if (questionTexts.has(questionKey)) {
            duplicates.push(i);
        } else {
            questionTexts.add(questionKey);
        }
        
        // Process question text for better rendering
        q.question = processQuestionText(q.question);
        q.explanation = processQuestionText(q.explanation);
        
        // Process options
        q.options = q.options.map(opt => processQuestionText(opt));
    });

    if (duplicates.length > 0) {
        console.error(`Found ${duplicates.length} duplicate questions at indices:`, duplicates);
        throw new Error(`Duplicate questions found at indices: ${duplicates.join(', ')}`);
    }

    console.log(`Successfully validated ${data.questions.length} unique questions`);
    return data;
};

export async function generateQuiz({ topic, level, count }) {
    // Validate and limit count to prevent excessive API usage
    const maxQuestions = 20;
    const validatedCount = Math.min(Math.max(parseInt(count) || 10, 1), maxQuestions);
    
    console.log(`Generating ${validatedCount} unique questions for ${topic} at ${level} level`);
    
    const prompt = `
Generate exactly ${validatedCount} UNIQUE multiple-choice questions for the topic "${topic}" at "${level}" difficulty level.

CRITICAL REQUIREMENTS:
1. Generate EXACTLY ${validatedCount} questions - no more, no less
2. Each question MUST be completely UNIQUE and different from others
3. NO duplicate or similar questions allowed
4. Each question must have exactly 4 options labeled A, B, C, D
5. Only one correct answer per question
6. Include detailed explanations for each answer

Topic: "${topic}"
Difficulty Level: "${level}"
Required Questions: ${validatedCount}

UNIQUENESS REQUIREMENTS:
- Each question must cover a DIFFERENT aspect of ${topic}
- Vary question types: conceptual, practical, code analysis, complexity, edge cases
- Use different scenarios and examples for each question
- Ensure no two questions test the same specific concept
- Cover breadth of ${topic} knowledge at ${level} difficulty

QUESTION VARIETY FOR ${topic}:
- Basic operations and properties
- Implementation details and algorithms
- Time and space complexity analysis
- Common use cases and applications
- Edge cases and error handling
- Comparison with other data structures
- Real-world problem scenarios
- Code analysis and debugging

DIFFICULTY GUIDELINES:

BASIC/EASY:
- Fundamental concepts and definitions
- Simple operations and basic understanding
- Straightforward examples without edge cases

MEDIUM:
- Concept application with moderate complexity
- Code analysis with clear logic
- Time/space complexity basics
- Common algorithms and operations

INTERMEDIATE/HARD:
- Advanced problem-solving scenarios
- Complex code analysis and optimization
- Edge cases and algorithmic thinking
- Performance considerations

EXPERT:
- Advanced algorithmic concepts
- Complex optimization problems
- Deep theoretical understanding
- Interview-level problem solving

FORMATTING RULES:
- If including code, use proper line breaks with \\n
- Keep questions clear and concise
- Make incorrect options plausible but clearly wrong
- Ensure explanations are educational and detailed

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "question": "Question text here (must be unique)",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Detailed explanation of why this is correct"
    }
  ]
}

IMPORTANT: Generate exactly ${validatedCount} COMPLETELY DIFFERENT questions. No duplicates or similar questions allowed.`;

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
                max_tokens: Math.min(4000, 200 * validatedCount), // Scale tokens with question count
            });

            const rawOutput = response.choices[0].message.content;
            
            try {
                const data = extractJSON(rawOutput);
                const validatedData = validateAndCleanQuizData(data);
                return validatedData;
            } catch (parseErr) {
                console.error("Failed to parse AI output. Raw output start:", rawOutput.substring(0, 200));
                console.error("Parse error:", parseErr.message);
                throw parseErr;
            }

        } catch (err) {
            console.error(`Attempt ${attempts} failed to generate quiz:`, err.message);
            if (attempts === maxAttempts) {
                // Return a fallback quiz if all attempts fail
                console.error("All attempts failed, returning fallback quiz");
                const fallbackQuestions = [];
                
                // Create unique fallback questions for the topic
                const fallbackTemplates = [
                    {
                        question: `What is the primary characteristic of a ${topic}?`,
                        options: [
                            "It follows FIFO (First In, First Out) principle",
                            "It follows LIFO (Last In, First Out) principle", 
                            "It allows random access to elements",
                            "It stores elements in sorted order"
                        ],
                        correctAnswer: topic.toLowerCase() === 'queue' ? "It follows FIFO (First In, First Out) principle" : "It follows LIFO (Last In, First Out) principle",
                        explanation: `A ${topic} is a linear data structure with specific ordering principles.`
                    },
                    {
                        question: `What is the time complexity of the basic insertion operation in a ${topic}?`,
                        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                        correctAnswer: "O(1)",
                        explanation: `Basic insertion in a ${topic} typically takes constant time O(1).`
                    },
                    {
                        question: `Which of the following is a common application of ${topic}?`,
                        options: [
                            "Function call management",
                            "Database indexing",
                            "Graph traversal",
                            "All of the above"
                        ],
                        correctAnswer: "All of the above",
                        explanation: `${topic} data structures have various applications in computer science.`
                    },
                    {
                        question: `What happens when you try to remove an element from an empty ${topic}?`,
                        options: [
                            "Returns null or throws an exception",
                            "Returns the last inserted element",
                            "Creates a new element",
                            "Nothing happens"
                        ],
                        correctAnswer: "Returns null or throws an exception",
                        explanation: `Attempting to remove from an empty ${topic} typically results in an error condition.`
                    },
                    {
                        question: `In terms of memory usage, how does a ${topic} compare to an array?`,
                        options: [
                            "Uses more memory due to pointer overhead",
                            "Uses exactly the same amount of memory",
                            "Uses less memory than arrays",
                            "Memory usage depends on the implementation"
                        ],
                        correctAnswer: "Memory usage depends on the implementation",
                        explanation: `Memory usage varies based on whether the ${topic} is implemented using arrays or linked structures.`
                    }
                ];

                for (let i = 0; i < validatedCount; i++) {
                    const template = fallbackTemplates[i % fallbackTemplates.length];
                    fallbackQuestions.push({
                        question: `${template.question} (Question ${i + 1})`,
                        options: template.options,
                        correctAnswer: template.correctAnswer,
                        explanation: `${template.explanation} This is a fallback question ${i + 1}.`
                    });
                }
                
                return { questions: fallbackQuestions };
            }
            // Wait before retrying with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
    }
}
