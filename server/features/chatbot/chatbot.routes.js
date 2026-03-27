import express from "express";
import { handleMessage } from "./chatbot.controller.js";
import { isAuthenticated } from "../../middlewares/auth.js";
import { aiLimiter as aiRateLimiter } from "../ai/ai.ratelimit.js";

const router = express.Router();

router.post("/message", isAuthenticated, aiRateLimiter, handleMessage);

export default router;
