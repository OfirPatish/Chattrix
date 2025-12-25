import mongoose from "mongoose";
import logger from "./logger.js";

export const setupGracefulShutdown = (httpServer, io) => {
  const gracefulShutdown = async (signal) => {
    logger.info({ signal }, "Shutting down gracefully...");

    // Close Socket.io server first
    if (io) {
      io.close(() => {
        logger.info("Socket.io server closed");
      });
    }

    httpServer.close(() => {
      logger.info("HTTP server closed");
      mongoose.connection.close(false, () => {
        logger.info("MongoDB connection closed");
        process.exit(0);
      });
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.fatal("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    logger.fatal({ err }, "Unhandled promise rejection - shutting down");
    gracefulShutdown("unhandledRejection");
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "Uncaught exception - shutting down");
    process.exit(1);
  });

  // Graceful shutdown signals
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};
