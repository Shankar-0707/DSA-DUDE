import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 AI calls per minute per user
  message: {
    error: "Too many AI requests. Please slow down."
  }
});
