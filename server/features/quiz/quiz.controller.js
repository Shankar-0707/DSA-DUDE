import { generateQuiz } from "./quiz.service.js";


const generateQuizController = async (req, res) => {
    const { topic, level, count } = req.query;

    console.log(`Quiz request: topic=${topic}, level=${level}, count=${count}`);

    if (!topic || !level || !count) {
        return res.status(400).json({ error: "Missing param for generateQuiz" });
    }

    try {
        const quiz = await generateQuiz({
            topic,
            level,
            count: Number(count),
        });

        console.log(`Generated quiz with ${quiz.questions?.length || 0} questions`);
        res.json(quiz);
    } catch (error) {
        console.error("Quiz generation error:", error);
        res.status(500).json({ error: "Failed to generate quiz", details: error.message });
    }
}

export default generateQuizController;