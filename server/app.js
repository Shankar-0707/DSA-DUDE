import "./env.js";
import express from "express";
import cors from "cors";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"
import aiRoutes from "./routes/ai.routes.js";
import userRoutes from "./routes/user.routes.js"
import savedProblemRoutes from "./routes/savedProblem.routes.js";
import visualizeRoutes from "./routes/visualize.routes.js"
import documentRoutes from "./routes/pdf_qna_tool/document.routes.js"
import generateQuizRoutes from "./routes/Quiz/quiz.routes.js";

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "UPDATE", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);
app.use("/user", userRoutes);
app.use("/problems", savedProblemRoutes);
app.use("/visualize",visualizeRoutes);
app.use('/documents', documentRoutes);
app.use('/quiz', generateQuizRoutes)

dbConnection();

app.use(errorMiddleware);

export default app;