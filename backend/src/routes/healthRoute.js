import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * Basic health check endpoint
 * Used for simple uptime monitoring
 */
router.get("/", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

/**
 * Detailed health check with database connection status
 * Used for more comprehensive system monitoring
 */
router.get("/detailed", async (req, res) => {
  let dbStatus = "DOWN";

  try {
    // Check database connection
    if (mongoose.connection.readyState === 1) {
      dbStatus = "UP";
    }

    res.status(200).json({
      status: "UP",
      database: dbStatus,
      timestamp: new Date(),
      environment: "development",
      uptime: `${Math.floor(process.uptime())} seconds`,
    });
  } catch (error) {
    res.status(500).json({
      status: "UP",
      database: "DOWN",
      error: error.message,
      timestamp: new Date(),
    });
  }
});

export default router;
