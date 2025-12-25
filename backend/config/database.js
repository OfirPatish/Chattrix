import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 30000, // Increase to 30 seconds for querySrv resolution
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 30000, // Connection timeout
      retryWrites: true,
      w: "majority",
    });

    logger.info(`📦 MongoDB connected`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error({ err }, "MongoDB connection error");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    // Note: Graceful shutdown is handled in server.js to coordinate
    // HTTP server and database shutdown together

    return conn;
  } catch (error) {
    logger.error({ err: error }, "MongoDB connection failed");
    throw error; // Throw instead of exit so we can handle it in startServer
  }
};

export default connectDB;
