// Core dependencies
import { Server } from "socket.io";
import http from "http";
import express from "express";
import appConfig from "../config/appConfig.js";

// Express application setup
const app = express();
const server = http.createServer(app);

// Extract origin from appConfig for Socket.io
const allowedOrigins = Array.isArray(appConfig.cors.origin) ? appConfig.cors.origin : [appConfig.cors.origin];

// Socket.io setup with CORS configuration matching Express
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// User-to-socket mapping for real-time presence tracking
const activeUserSockets = {}; // {userId: socketId}

/**
 * Retrieves a user's socket ID by their user ID
 * Used to target specific users for real-time messaging
 *
 * @param {string} userId - The user's unique identifier
 * @returns {string|undefined} The socket ID if user is connected
 */
export function getUserSocketId(userId) {
  return activeUserSockets[userId];
}

// Socket connection handling
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // Track connected user if ID is valid
  if (userId !== "undefined") {
    activeUserSockets[userId] = socket.id;
  }

  // Broadcast online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(activeUserSockets));

  console.log(`Socket connected: ${socket.id}`);

  // Handle client disconnection
  socket.on("disconnect", () => {
    if (userId !== "undefined") {
      delete activeUserSockets[userId];
    }

    // Update online users list for all clients
    io.emit("getOnlineUsers", Object.keys(activeUserSockets));

    console.log(`Socket disconnected: ${socket.id}`);
  });
});

export { io, app, server };
