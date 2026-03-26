// Simple in-memory rate limiter for AI endpoints
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per user

export const aiRateLimiter = (req, res, next) => {
    const userId = req.user?._id?.toString();
    
    if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
    }

    const now = Date.now();
    const userKey = `ai_${userId}`;
    
    // Get or initialize user's request history
    if (!requestCounts.has(userKey)) {
        requestCounts.set(userKey, []);
    }
    
    const userRequests = requestCounts.get(userKey);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    
    // Check if user has exceeded the limit
    if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        const oldestRequest = Math.min(...validRequests);
        const resetTime = oldestRequest + RATE_LIMIT_WINDOW;
        const waitTime = Math.ceil((resetTime - now) / 1000);
        
        return res.status(429).json({
            error: `Too many AI requests. Please wait ${waitTime} seconds before trying again.`,
            retryAfter: waitTime,
            limit: MAX_REQUESTS_PER_WINDOW,
            windowMs: RATE_LIMIT_WINDOW
        });
    }
    
    // Add current request
    validRequests.push(now);
    requestCounts.set(userKey, validRequests);
    
    // Add rate limit headers
    res.set({
        'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW,
        'X-RateLimit-Remaining': Math.max(0, MAX_REQUESTS_PER_WINDOW - validRequests.length),
        'X-RateLimit-Reset': new Date(now + RATE_LIMIT_WINDOW).toISOString()
    });
    
    next();
};

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, requests] of requestCounts.entries()) {
        const validRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
        if (validRequests.length === 0) {
            requestCounts.delete(key);
        } else {
            requestCounts.set(key, validRequests);
        }
    }
}, RATE_LIMIT_WINDOW);