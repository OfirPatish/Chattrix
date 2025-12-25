import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import mongoose from "mongoose";
import { NotFoundError, BadRequestError, ForbiddenError } from "../errors/AppError.js";
import { getSkip, getPaginationMeta } from "../utils/pagination.js";

export const getChatMessages = async (chatId, page = 1, limit = 50) => {
  const skip = getSkip(page, limit);

  const [messages, total] = await Promise.all([
    Message.find({ chat: chatId })
      .populate({
        path: "sender",
        select: "username email avatar",
      })
      .select("content sender chat createdAt messageType imageUrl readBy")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip),
    Message.countDocuments({ chat: chatId }),
  ]);

  return {
    messages: messages.reverse(), // Return in chronological order
    pagination: getPaginationMeta(total, page, limit, messages.length),
  };
};

export const createMessage = async (userId, chatId, content, messageType, imageUrl) => {
  // Validate content length
  const trimmedContent = content.trim();
  if (trimmedContent.length === 0) {
    throw new BadRequestError("Message content cannot be empty");
  }
  if (trimmedContent.length > 5000) {
    throw new BadRequestError("Message content cannot exceed 5000 characters");
  }

  // Verify user is part of the chat
  const chat = await Chat.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  }).select("participants");

  if (!chat) {
    throw new NotFoundError("Chat not found or access denied");
  }

  // Use transaction to ensure atomicity (skip in test environment as MongoDB Memory Server doesn't support transactions)
  const useTransaction = process.env.NODE_ENV !== "test";
  
  if (useTransaction) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const message = await Message.create(
        [
          {
            sender: userId,
            chat: chatId,
            content: trimmedContent,
            messageType: messageType || "text",
            imageUrl: imageUrl || "",
          },
        ],
        { session }
      );

      // Update chat's last message
      await Chat.findByIdAndUpdate(
        chatId,
        { lastMessage: message[0]._id },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      // Populate message data
      const populatedMessage = await Message.findById(message[0]._id)
        .populate({
          path: "sender",
          select: "username email avatar",
        })
        .select("content sender chat createdAt messageType imageUrl readBy");

      return populatedMessage;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } else {
    // Test environment: create without transaction
    const message = await Message.create({
      sender: userId,
      chat: chatId,
      content: trimmedContent,
      messageType: messageType || "text",
      imageUrl: imageUrl || "",
    });

    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    // Populate message data
    const populatedMessage = await Message.findById(message._id)
      .populate({
        path: "sender",
        select: "username email avatar",
      })
      .select("content sender chat createdAt messageType imageUrl readBy");

    return populatedMessage;
  }
};

export const markMessageAsRead = async (messageId, userId) => {
  const message = await Message.findById(messageId).select("readBy chat");

  if (!message) {
    throw new NotFoundError("Message not found");
  }

  // Verify user is part of the chat
  const chat = await Chat.findById(message.chat).select("participants");
  if (!chat || !chat.participants.includes(userId)) {
    throw new ForbiddenError("Access denied");
  }

  // Check if already read by this user
  const alreadyRead = message.readBy.some(
    (read) => read.user.toString() === userId.toString()
  );

  if (!alreadyRead) {
    message.readBy.push({
      user: userId,
      readAt: new Date(),
    });
    await message.save();
  }

  return message;
};

