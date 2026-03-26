import { generateQuiz } from "./quiz.service.js";

const testQuizController = async (req, res) => {
    const { topic = "Queue", level = "Easy", count = 15 } = req.query;

    console.log(`\n=== QUIZ TEST ===`);
    console.log(`Topic: ${topic}`);
    console.log(`Level: ${level}`);
    console.log(`Count: ${count}`);
    console.log(`================\n`);

    try {
        const startTime = Date.now();
        const quiz = await generateQuiz({
            topic,
            level,
            count: Number(count),
        });
        const endTime = Date.now();

        const result = {
            success: true,
            requestedCount: Number(count),
            actualCount: quiz.questions?.length || 0,
            generationTime: `${endTime - startTime}ms`,
            questions: quiz.questions?.map((q, i) => ({
                index: i + 1,
                questionLength: q.question?.length || 0,
                optionsCount: q.options?.length || 0,
                hasCorrectAnswer: q.options?.includes(q.correctAnswer) || false,
                hasExplanation: !!q.explanation
            })) || []
        };

        console.log(`\n=== RESULT ===`);
        console.log(`Requested: ${result.requestedCount} questions`);
        console.log(`Generated: ${result.actualCount} questions`);
        console.log(`Time: ${result.generationTime}`);
        console.log(`Success: ${result.actualCount === result.requestedCount}`);
        console.log(`==============\n`);

        res.json(result);
    } catch (error) {
        console.error("Quiz test error:", error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            requestedCount: Number(count),
            actualCount: 0
        });
    }
};

export default testQuizController;