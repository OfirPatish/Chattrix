import jwt from "jsonwebtoken";
import User from "../models/User.js";
import * as chatService from "../services/chatService.js";
import * as messageService from "../services/messageService.js";
import logger from "../utils/logger.js";

export const setupSocketHandlers = (io) => {
  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Socket.io connection handling
  io.on("connection", async (socket) => {
    // Safety check: ensure user is authenticated
    if (!socket.user || !socket.userId) {
      logger.warn("Socket connection without authenticated user");
      socket.disconnect();
      return;
    }

    logger.info(`👤 ${socket.user.username} connected`);

    // Update user online status and fetch chats in parallel
    try {
      const [chatIds] = await Promise.all([
        chatService.getUserChatIds(socket.userId),
        User.findByIdAndUpdate(
          socket.userId,
          {
            isOnline: true,
            lastSeen: new Date(),
          },
          { new: false }
        ),
      ]);

      // Join user's personal room
      socket.join(socket.userId);

      // Join all chat rooms user is part of (optimized)
      if (chatIds.length > 0) {
        socket.join(chatIds);
      }
    } catch (error) {
      logger.error({ err: error }, "Error setting up socket connection");
    }

    // Emit online status to all contacts
    socket.broadcast.emit("user-online", {
      userId: socket.userId,
      isOnline: true,
    });

    // Handle join chat room
    socket.on("join-chat", async (chatId) => {
      try {
        await chatService.verifyChatAccess(chatId, socket.userId);
        socket.join(chatId);
      } catch (error) {
        logger.error({ err: error }, "Join chat error");
        socket.emit("error", {
          message: error.message || "Failed to join chat",
        });
      }
    });

    // Handle leave chat room
    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
    });

    // Handle new message
    socket.on("send-message", async (data) => {
      try {
        // Validate input data
        if (!data || !data.chatId || !data.content) {
          socket.emit("error", { message: "Chat ID and content are required" });
          return;
        }

        const { chatId, content, messageType, imageUrl } = data;

        // Verify user is part of the chat
        await chatService.verifyChatAccess(chatId, socket.userId);

        // Create message using service (includes transaction)
        const populatedMessage = await messageService.createMessage(
          socket.userId,
          chatId,
          content,
          messageType,
          imageUrl
        );

        // Emit to all users in the chat room
        io.to(chatId).emit("receive-message", populatedMessage);

        // Emit typing stopped
        socket.to(chatId).emit("typing-stopped", {
          userId: socket.userId,
          username: socket.user.username,
        });
      } catch (error) {
        logger.error({ err: error }, "Send message error");
        socket.emit("error", {
          message: error.message || "Failed to send message",
        });
      }
    });

    // Handle typing indicator
    socket.on("typing-start", (data) => {
      if (!data || !data.chatId) {
        return;
      }
      const { chatId } = data;
      socket.to(chatId).emit("typing-start", {
        userId: socket.userId,
        username: socket.user.username,
      });
    });

    socket.on("typing-stop", (data) => {
      if (!data || !data.chatId) {
        return;
      }
      const { chatId } = data;
      socket.to(chatId).emit("typing-stopped", {
        userId: socket.userId,
        username: socket.user.username,
      });
    });

    // Handle message read
    socket.on("mark-read", async (data) => {
      try {
        // Validate input
        if (!data || !data.messageId) {
          socket.emit("error", { message: "Message ID is required" });
          return;
        }

        const { messageId } = data;
        const message = await messageService.markMessageAsRead(
          messageId,
          socket.userId
        );

        // Emit read notification
        io.to(message.chat.toString()).emit("message-read", {
          messageId: message._id,
          userId: socket.userId,
        });
      } catch (error) {
        logger.error({ err: error }, "Mark read error");
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      // Safety check: user might be undefined if connection failed
      if (!socket.user || !socket.userId) {
        return;
      }

      logger.info(`👤 ${socket.user.username} disconnected`);

      // Update user offline status
      try {
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        // Emit offline status to all contacts
        socket.broadcast.emit("user-offline", {
          userId: socket.userId,
          isOnline: false,
        });
      } catch (error) {
        logger.error({ err: error }, "Error updating user offline status");
      }
    });
  });
};
