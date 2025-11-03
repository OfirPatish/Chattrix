import express from "express";
import corsMiddleware from "./config/cors.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";
import healthRoutes, { healthCheckRouter } from "./routes/healthRoutes.js";

const app = express();

// Trust proxy (required for Render and other hosting platforms)
app.set("trust proxy", 1);

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
