import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

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
    console.log(`✅ User connected: ${socket.user.username} (${socket.userId})`);

    // Update user online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date(),
    });

    // Join user's personal room
    socket.join(socket.userId);

    // Join all chat rooms user is part of
    const userChats = await Chat.find({
      participants: { $in: [socket.userId] },
    });

    userChats.forEach((chat) => {
      socket.join(chat._id.toString());
    });

    // Emit online status to all contacts
    socket.broadcast.emit("user-online", {
      userId: socket.userId,
      isOnline: true,
    });

    // Handle join chat room
    socket.on("join-chat", async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat && chat.participants.includes(socket.userId)) {
          socket.join(chatId);
          console.log(`User ${socket.user.username} joined chat ${chatId}`);
        }
      } catch (error) {
        console.error("Join chat error:", error);
        socket.emit("error", { message: "Failed to join chat" });
      }
    });

    // Handle leave chat room
    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.user.username} left chat ${chatId}`);
    });

    // Handle new message
    socket.on("send-message", async (data) => {
      try {
        const { chatId, content, messageType, imageUrl } = data;

        // Verify user is part of the chat
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(socket.userId)) {
          socket.emit("error", { message: "Access denied" });
          return;
        }

        // Create message
        const message = await Message.create({
          sender: socket.userId,
          chat: chatId,
          content,
          messageType: messageType || "text",
          imageUrl: imageUrl || "",
        });

        // Update chat's last message
        chat.lastMessage = message._id;
        await chat.save();

        // Populate message data
        const populatedMessage = await Message.findById(message._id).populate(
          "sender",
          "username email avatar"
        );

        // Emit to all users in the chat room
        io.to(chatId).emit("receive-message", populatedMessage);

        // Emit typing stopped
        socket.to(chatId).emit("typing-stopped", {
          userId: socket.userId,
          username: socket.user.username,
        });
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicator
    socket.on("typing-start", (data) => {
      const { chatId } = data;
      socket.to(chatId).emit("typing-start", {
        userId: socket.userId,
        username: socket.user.username,
      });
    });

    socket.on("typing-stop", (data) => {
      const { chatId } = data;
      socket.to(chatId).emit("typing-stopped", {
        userId: socket.userId,
        username: socket.user.username,
      });
    });

    // Handle message read
    socket.on("mark-read", async (data) => {
      try {
        const { messageId } = data;
        const message = await Message.findById(messageId);

        if (message) {
          const alreadyRead = message.readBy.some(
            (read) => read.user.toString() === socket.userId
          );

          if (!alreadyRead) {
            message.readBy.push({
              user: socket.userId,
              readAt: new Date(),
            });
            await message.save();

            // Notify sender that message was read
            const chat = await Chat.findById(message.chat);
            if (chat) {
              io.to(message.chat.toString()).emit("message-read", {
                messageId: message._id,
                userId: socket.userId,
              });
            }
          }
        }
      } catch (error) {
        console.error("Mark read error:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`❌ User disconnected: ${socket.user.username}`);

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      // Emit offline status to all contacts
      socket.broadcast.emit("user-offline", {
        userId: socket.userId,
        isOnline: false,
      });
    });
  });
};

