import { createServer } from "http";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import validateEnv from "./config/env.js";
import app from "./app.js";
import { createSocketServer } from "./config/socket.js";
import { setupSocketHandlers } from "./socket/socketHandlers.js";
import { setupGracefulShutdown } from "./utils/shutdown.js";
import { setIoInstance } from "./routes/healthRoutes.js";
import logger from "./utils/logger.js";

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.io server (async - may need Redis connection)
let io;

// Setup graceful shutdown handlers (will be set after io is created)

// Start server after database connection (best practice)
const startServer = async () => {
  try {
    // Connect to database first - wait for connection
    await connectDB();

    // Create Socket.io server (may connect to Redis)
    io = await createSocketServer(httpServer);

    // Set io instance for health check
    setIoInstance(io);

    // Setup Socket.io handlers
    setupSocketHandlers(io);

    // Setup graceful shutdown handlers
    setupGracefulShutdown(httpServer, io);

    // Start server only after DB is ready
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.fatal({ err: error }, "Failed to start server");
    process.exit(1); // Exit with error code for deployment platforms
  }
};

startServer();
