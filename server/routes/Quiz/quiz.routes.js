import express from "express";
import generateQuizController from "../../controllers/Quiz/quiz.controller.js";
import { isAuthenticated } from "../../middlewares/auth.js";
const router = express.Router();

router.get("/generate", isAuthenticated, generateQuizController);
export default router;