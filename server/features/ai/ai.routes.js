import express from "express";
import { solveProblem, searchProblemByName } from "./ai.controller.js";
import { testAIConnection } from "./ai.test.controller.js";
import { isAuthenticated } from "../../middlewares/auth.js";
// import { aiLimiter } from "../controllers/ai.ratelimit.controller.js"; // Temporarily disabled

const router = express.Router();

// Temporarily remove rate limiter to test if it's causing issues
router.post("/approach", isAuthenticated, solveProblem);
router.post("/search-name", isAuthenticated, searchProblemByName);
router.get("/test", testAIConnection); // Test endpoint without auth for debugging

export default router;
