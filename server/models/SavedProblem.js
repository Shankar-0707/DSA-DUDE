import mongoose from "mongoose";

const savedProblemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        problemDescription: {
            type: String,
            required: true,
        },
        constraints: {
            type: String,
        },
        tags: {
            type: [String],
            default: []
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard", "Unknown"],
            default: "Unknown"
        },
        approach: {
            type: mongoose.Schema.Types.Mixed, // Can be string or array of strings
        },
        complexity: {
            type: String,
        },
        solutions: {
            type: Map,
            of: String, // Language -> Code
        },
        savedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export default mongoose.model("SavedProblem", savedProblemSchema);
