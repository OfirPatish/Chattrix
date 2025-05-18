import helmet from "helmet";
import rateLimit from "express-rate-limit";

/**
 * Security headers middleware using Helmet
 * Helps protect app from some well-known web vulnerabilities
 * Customized CSP to allow images from trusted sources
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://i.ibb.co", "https://picsum.photos", "https://fastly.picsum.photos"],
    },
  },
});

/**
 * API rate limiting middleware
 * Protects against brute force attacks
 *
 * Development configuration with high limits
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});
