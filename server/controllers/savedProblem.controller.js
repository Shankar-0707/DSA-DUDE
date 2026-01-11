import SavedProblem from "../models/SavedProblem.js";

export const saveProblem = async (req, res, next) => {
    try {
        const { title, problemDescription, constraints, tags, difficulty, approach, complexity, solutions } = req.body;
        const userId = req.user._id;

        if (!title || !problemDescription) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        // Check availability
        // Optional: Avoid duplicates?
        // Let's allow duplicates for now or maybe check title+user uniquely.
        // For now, simple create.

        const newSavedProblem = await SavedProblem.create({
            user: userId,
            title,
            problemDescription,
            constraints,
            tags,
            difficulty,
            approach,
            complexity,
            solutions
        });

        res.status(201).json({
            message: "Problem saved successfully",
            savedProblem: newSavedProblem
        });
    } catch (error) {
        next(error);
    }
};

export const getSavedProblems = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const savedProblems = await SavedProblem.find({ user: userId }).sort({ savedAt: -1 });

        res.status(200).json(savedProblems);
    } catch (error) {
        next(error);
    }
};

export const deleteSavedProblem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const problem = await SavedProblem.findOneAndDelete({ _id: id, user: userId });

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.status(200).json({ message: "Problem deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const getSavedProblemById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const problem = await SavedProblem.findOne({ _id: id, user: userId });

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.status(200).json(problem);
    } catch (error) {
        next(error);
    }
};
