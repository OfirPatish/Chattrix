import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Root route (for health checks)
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chattrix API Server",
    api: "/api",
    health: "/api/health",
  });
});

// Suppress favicon.ico requests (browsers auto-request this)
router.get("/favicon.ico", (req, res) => res.status(204).end());

export default router;

// Health check route (separate export for mounting at /api/health)
export const healthCheckRouter = express.Router();

healthCheckRouter.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  if (dbStatus === 1) {
    res.json({
      success: true,
      status: "OK",
      message: "Server is running",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      success: false,
      status: "SERVICE_UNAVAILABLE",
      message: "Database not connected",
      database: dbStatus === 0 ? "disconnected" : "connecting",
      timestamp: new Date().toISOString(),
    });
  }
});

