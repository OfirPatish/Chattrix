import express from "express";
import compression from "compression";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import corsMiddleware from "./config/cors.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";
import healthRoutes, { healthCheckRouter } from "./routes/healthRoutes.js";

const app = express();

// Trust proxy (required for Render and other hosting platforms)
app.set("trust proxy", 1);

// Compression middleware - compress responses for better performance
app.use(compression());

// Security middleware - helmet for HTTP headers protection
app.use(helmet());

// CORS middleware - must be first to handle preflight requests
app.use(corsMiddleware);

// Body parsing middleware with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Data sanitization - prevent NoSQL injection attacks
app.use(mongoSanitize());

// Rate limiting (production only)
if (process.env.NODE_ENV === "production") {
  app.use("/api/", rateLimiter);
}

// Routes
app.use("/", healthRoutes); // Root and favicon routes
app.use("/api/health", healthCheckRouter); // Health check at /api/health
app.use("/api", apiRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
