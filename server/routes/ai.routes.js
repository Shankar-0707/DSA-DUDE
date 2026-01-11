import express from "express";
import { solveProblem, searchProblemByName } from "../controllers/ai.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/approach", isAuthenticated, solveProblem);
router.post("/search-name", isAuthenticated, searchProblemByName);

export default router;
