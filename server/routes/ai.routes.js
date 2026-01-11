import express from "express";
import { solveProblem, searchProblemByName } from "../controllers/ai.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { aiLimiter } from "../controllers/ai.ratelimit.controller.js";

const router = express.Router();

router.post("/approach", isAuthenticated,aiLimiter, solveProblem);
router.post("/search-name", isAuthenticated,aiLimiter, searchProblemByName);

export default router;
