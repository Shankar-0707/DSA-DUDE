import "./env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";

import authRoutes     from "./features/auth/auth.routes.js";
import aiRoutes       from "./features/ai/ai.routes.js";
import userRoutes     from "./features/user/user.routes.js";
import problemRoutes  from "./features/problems/problems.routes.js";
import visualizeRoutes from "./features/visualize/visualize.routes.js";
import pdfRoutes      from "./features/pdf/pdf.routes.js";
import quizRoutes     from "./features/quiz/quiz.routes.js";

const app = express();

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

const corsOptions = {
    origin: (origin, callback) => {
        const allowed = [
            "http://localhost:5173",
            "http://localhost:3000",
            ...(process.env.FRONTEND_URL
                ? process.env.FRONTEND_URL.split(",").map(u => u.trim())
                : [])
        ];
        // Allow requests with no origin (mobile apps, curl, Postman, etc.)
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true
};

// Handle preflight OPTIONS requests with the SAME corsOptions (credentials + whitelist)
app.options("/{*path}", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth",      authRoutes);

// Temp debug route - remove after confirming env vars work
app.get("/debug-env", (req, res) => {
  res.json({
    FRONTEND_URL: process.env.FRONTEND_URL || "NOT SET",
    NODE_ENV: process.env.NODE_ENV || "NOT SET",
    HAS_MONGO: !!process.env.MONGO_URI,
    HAS_JWT: !!process.env.JWT_SECRET,
  });
});
app.use("/ai",        aiRoutes);
app.use("/user",      userRoutes);
app.use("/problems",  problemRoutes);
app.use("/visualize", visualizeRoutes);
app.use("/documents", pdfRoutes);
app.use("/quiz",      quizRoutes);

dbConnection();

app.use(errorMiddleware);

export default app;
