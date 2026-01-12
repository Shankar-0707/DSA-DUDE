import express from "express";
import { validateProblem, generateTrace } from "../controllers/visualize.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/validate", isAuthenticated, validateProblem);
router.post("/trace", isAuthenticated, generateTrace);

export default router;
