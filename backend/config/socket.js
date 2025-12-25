import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { socketCorsOptions } from "./cors.js";
import logger from "../utils/logger.js";

export const createSocketServer = async (httpServer) => {
  const io = new Server(httpServer, {
    cors: socketCorsOptions,
  });

  // Setup Redis adapter for horizontal scaling (optional)
  if (process.env.REDIS_URL) {
    try {
      const pubClient = createClient({ url: process.env.REDIS_URL });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);

      io.adapter(createAdapter(pubClient, subClient));

      logger.info("Redis adapter connected for Socket.io scaling");

      // Handle Redis connection errors
      pubClient.on("error", (err) => {
        logger.error({ err }, "Redis pub client error");
      });

      subClient.on("error", (err) => {
        logger.error({ err }, "Redis sub client error");
      });
    } catch (error) {
      logger.warn(
        { err: error },
        "Failed to connect Redis adapter, Socket.io will run in single-instance mode"
      );
    }
  } else {
    // Redis not configured, running in single-instance mode (silent)
  }

  return io;
};
