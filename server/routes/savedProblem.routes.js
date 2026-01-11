import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { saveProblem, getSavedProblems, deleteSavedProblem, getSavedProblemById } from "../controllers/savedProblem.controller.js";

const router = express.Router();

router.post("/save", isAuthenticated, saveProblem);
router.get("/list", isAuthenticated, getSavedProblems);
router.delete("/:id", isAuthenticated, deleteSavedProblem);
router.get("/:id", isAuthenticated, getSavedProblemById);

export default router;
