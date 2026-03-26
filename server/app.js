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

app.use(cors({
    origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",").map(u => u.trim())
        : ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Handle preflight requests explicitly
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth",      authRoutes);
app.use("/ai",        aiRoutes);
app.use("/user",      userRoutes);
app.use("/problems",  problemRoutes);
app.use("/visualize", visualizeRoutes);
app.use("/documents", pdfRoutes);
app.use("/quiz",      quizRoutes);

dbConnection();

app.use(errorMiddleware);

export default app;
