import rateLimit from "express-rate-limit";

// General API rate limiter - 100 requests per 15 minutes
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Too many requests, please try again later",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip CORS preflight requests and test environment
    if (req.method === "OPTIONS") return true;
    if (process.env.NODE_ENV === "test") return true;
    return false;
  },
});

// Stricter rate limiter for authentication endpoints - 5 attempts per 15 minutes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip CORS preflight requests and test environment
    if (req.method === "OPTIONS") return true;
    if (process.env.NODE_ENV === "test") return true;
    return false;
  },
});
