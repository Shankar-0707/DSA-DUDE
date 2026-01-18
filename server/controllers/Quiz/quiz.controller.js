import { generateQuiz } from "../../services/Quiz/openai.service.js";


const generateQuizController = async (req, res) => {
    const { topic, level, count } = req.query;

    if (!topic || !level || !count) {
        return res.status(400).json({ error: "Missing param for generateQuiz" });
    }

    try {
        const quiz = await generateQuiz({
            topic,
            level,
            count: Number(count),
        })

        res.json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate quiz" });
    }
}

export default generateQuizController;