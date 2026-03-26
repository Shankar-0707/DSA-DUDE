import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // Increased from 5 to 15 AI calls per minute per user
  message: {
    error: "Too many AI requests. Please wait a moment and try again.",
    retryAfter: 60
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests in count
  skipSuccessfulRequests: false,
  // Skip failed requests in count
  skipFailedRequests: true,
});
