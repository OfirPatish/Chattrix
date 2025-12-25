import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { NotFoundError, BadRequestError } from "../errors/AppError.js";

export const getUserChats = async (userId) => {
  const chats = await Chat.find({
    participants: { $in: [userId] },
  })
    .populate({
      path: "participants",
      select: "username email avatar isOnline",
    })
    .populate({
      path: "lastMessage",
      select: "content sender createdAt messageType",
      populate: {
        path: "sender",
        select: "username avatar",
      },
    })
    .select("participants lastMessage updatedAt createdAt")
    .sort({ updatedAt: -1 })
    .lean();

  return chats;
};

export const getOrCreateChat = async (userId, otherUserId) => {
  // Prevent users from creating chats with themselves
  if (userId.toString() === otherUserId.toString()) {
    throw new BadRequestError("Cannot create a chat with yourself");
  }

  // Validate that the other user exists
  const otherUser = await User.findById(otherUserId);
  if (!otherUser) {
    throw new NotFoundError("User not found");
  }

  // Check if chat already exists
  let chat = await Chat.findOne({
    participants: { $all: [userId, otherUserId] },
  })
    .populate({
      path: "participants",
      select: "username email avatar isOnline",
    })
    .populate({
      path: "lastMessage",
      select: "content sender createdAt messageType",
      populate: {
        path: "sender",
        select: "username avatar",
      },
    })
    .select("participants lastMessage updatedAt createdAt");

  if (chat) {
    // Return existing chat with flag
    return { chat, isNew: false };
  }

  // Create new chat
  chat = await Chat.create({
    participants: [userId, otherUserId],
  });

  chat = await Chat.findById(chat._id)
    .populate({
      path: "participants",
      select: "username email avatar isOnline",
    })
    .populate({
      path: "lastMessage",
      select: "content sender createdAt messageType",
      populate: {
        path: "sender",
        select: "username avatar",
      },
    })
    .select("participants lastMessage updatedAt createdAt");

  return { chat, isNew: true };
};

export const getChatById = async (chatId, userId) => {
  const chat = await Chat.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  })
    .populate({
      path: "participants",
      select: "username email avatar isOnline",
    })
    .populate({
      path: "lastMessage",
      select: "content sender createdAt messageType",
      populate: {
        path: "sender",
        select: "username avatar",
      },
    })
    .select("participants lastMessage updatedAt createdAt");

  if (!chat) {
    throw new NotFoundError("Chat not found");
  }

  return chat;
};

export const verifyChatAccess = async (chatId, userId) => {
  const chat = await Chat.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  }).select("participants");

  if (!chat) {
    throw new NotFoundError("Chat not found or access denied");
  }

  return chat;
};

export const getUserChatIds = async (userId) => {
  const chats = await Chat.find({
    participants: { $in: [userId] },
  }).select("_id").lean();

  return chats.map((chat) => chat._id.toString());
};

