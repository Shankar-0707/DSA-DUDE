import express from "express";
import { validatePrefixSum, tracePrefixSum } from "../controllers/visualize.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/validate",isAuthenticated, validatePrefixSum);
router.post("/trace",isAuthenticated, tracePrefixSum);

export default router;
