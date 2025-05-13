// Core dependencies
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

// Application imports
import { app, server } from "./lib/socket.js";
import { connectToMongoDB } from "./lib/database.js";
import appConfig from "./config/appConfig.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { securityHeaders, apiLimiter } from "./middleware/securityMiddleware.js";

// Routes
import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";
import healthRoute from "./routes/healthRoute.js";

// Security middleware
app.use(securityHeaders);

// Request logging
app.use(morgan("dev"));

// Parse cookies before CORS handling
app.use(cookieParser());

// CORS configuration - must come before route handlers
app.use(cors(appConfig.cors));

// Handle OPTIONS preflight requests
app.options("*", cors(appConfig.cors));

// Request parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/plain" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Response compression
app.use(compression());

// API routes with rate limiting
app.use("/api/auth", apiLimiter, authRoute);
app.use("/api/messages", apiLimiter, messageRoute);

// Health check routes (no rate limiting)
app.use("/health", healthRoute);

// Global error handler must be last middleware
app.use(errorHandler);

// Server startup
server.listen(appConfig.server.port, () => {
  console.log(`Server is running on port: ${appConfig.server.port}`);
  connectToMongoDB();
});
