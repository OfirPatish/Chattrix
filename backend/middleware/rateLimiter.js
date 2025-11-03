// Simple in-memory rate limiter (for production, use Redis-based rate limiter)
const requestCounts = new Map();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

export const rateLimiter = (req, res, next) => {
  // Get client IP - works with trust proxy setting
  // req.ip is available when trust proxy is enabled
  const clientId = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  if (!requestCounts.has(clientId)) {
    requestCounts.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return next();
  }

  const clientData = requestCounts.get(clientId);

  if (now > clientData.resetTime) {
    // Reset window
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
    return next();
  }

  if (clientData.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: "Too many requests, please try again later",
    });
  }

  clientData.count++;
  next();
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);
