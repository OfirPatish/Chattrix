import { createServer } from "http";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import validateEnv from "./config/env.js";
import app from "./app.js";
import { createSocketServer } from "./config/socket.js";
import { setupSocketHandlers } from "./socket/socketHandlers.js";
import { setupGracefulShutdown } from "./utils/shutdown.js";

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.io server
const io = createSocketServer(httpServer);

// Setup Socket.io handlers
setupSocketHandlers(io);

// Setup graceful shutdown handlers
setupGracefulShutdown(httpServer);

// Start server after database connection (best practice)
const startServer = async () => {
  try {
    // Connect to database first - wait for connection
    await connectDB();
    console.log("✅ Database connected, starting server...");

    // Start server only after DB is ready
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Exit with error code for deployment platforms
  }
};

startServer();
