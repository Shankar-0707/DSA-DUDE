import { aiValidateProblem, aiGenerateTrace } from "../services/ai.service.js";

export const validateProblem = async (req, res) => {
    const { problem, constraints, code } = req.body;

    try {
        const result = await aiValidateProblem(problem, constraints, code);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const generateTrace = async (req, res) => {
    let { code, input, problemType } = req.body;

    try {
        // Parse input if it's a string representation of JSON
        if (typeof input === "string") {
            try {
                input = JSON.parse(input);
            } catch (e) {
                // Keep as string if not valid JSON
            }
        }
        const trace = await aiGenerateTrace(code, input, problemType);
        res.json(trace);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
