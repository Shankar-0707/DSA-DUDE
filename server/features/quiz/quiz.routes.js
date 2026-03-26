import express from "express";
import generateQuizController from "./quiz.controller.js";
import testQuizController from "./quiz.test.controller.js";
import { isAuthenticated } from "../../middlewares/auth.js";
const router = express.Router();

router.get("/generate", isAuthenticated, generateQuizController);
router.get("/test", testQuizController); // Test endpoint without auth for debugging
export default router;