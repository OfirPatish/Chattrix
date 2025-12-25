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

// Store io instance for health check
let ioInstance = null;

export const setIoInstance = (io) => {
  ioInstance = io;
};

// Health check route (separate export for mounting at /api/health)
export const healthCheckRouter = express.Router();

healthCheckRouter.get("/", async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  // Get Socket.io metrics
  let socketioStatus = "unknown";
  let socketioConnections = 0;
  let socketioRooms = 0;

  if (ioInstance) {
    try {
      const sockets = await ioInstance.fetchSockets();
      socketioConnections = sockets.length;
      socketioStatus = "connected";

      // Count rooms (approximate)
      const rooms = ioInstance.sockets.adapter.rooms;
      socketioRooms = rooms ? rooms.size : 0;
    } catch (error) {
      socketioStatus = "error";
      console.error("Error fetching Socket.io metrics:", error);
    }
  } else {
    socketioStatus = "not_initialized";
  }

  const isHealthy = dbStatus === 1 && socketioStatus !== "error";

  const response = {
    success: isHealthy,
    status: isHealthy ? "OK" : "SERVICE_UNAVAILABLE",
    message: isHealthy ? "Server is running" : "Service unavailable",
    database:
      dbStatus === 1
        ? "connected"
        : dbStatus === 0
        ? "disconnected"
        : "connecting",
    socketio: {
      status: socketioStatus,
      connections: socketioConnections,
      rooms: socketioRooms,
    },
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
        100,
      unit: "MB",
    },
    timestamp: new Date().toISOString(),
  };

  if (isHealthy) {
    res.json(response);
  } else {
    res.status(503).json(response);
  }
});

