import mongoose from "mongoose";

const problemHistorySchema = new mongoose.Schema(
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
        approach: {
            type: mongoose.Schema.Types.Mixed,
        },
        complexity: {
            type: String,
        },
        solutions: {
            type: Map,
            of: String,
        },
        type: {
            type: String,
            enum: ["search", "solve"],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ProblemHistory", problemHistorySchema);
