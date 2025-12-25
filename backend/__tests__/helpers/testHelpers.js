import User from "../../models/User.js";
import Chat from "../../models/Chat.js";
import Message from "../../models/Message.js";
import * as authService from "../../services/authService.js";

/**
 * Create a test user and return user data with tokens
 */
export const createTestUser = async (userData = {}) => {
  // Generate short username (max 20 chars): "test" + last 6 digits of timestamp
  const timestamp = Date.now().toString().slice(-6);
  const defaultData = {
    username: `test${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: "Test1234",
    ...userData,
  };

  const result = await authService.registerUser(
    defaultData.username,
    defaultData.email,
    defaultData.password
  );

  return {
    ...result.user,
    password: defaultData.password,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
};

/**
 * Create multiple test users
 */
export const createTestUsers = async (count = 2) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    // Generate short username (max 20 chars): "test" + index + last 5 digits of timestamp
    const timestamp = Date.now().toString().slice(-5);
    const user = await createTestUser({
      username: `test${i}${timestamp}`,
      email: `test${i}${timestamp}@example.com`,
    });
    users.push(user);
  }
  return users;
};

/**
 * Create a test chat between two users
 */
export const createTestChat = async (user1Id, user2Id) => {
  const chat = await Chat.create({
    participants: [user1Id, user2Id],
  });
  
  return await Chat.findById(chat._id)
    .populate("participants", "username email avatar")
    .lean();
};

/**
 * Create a test message in a chat
 */
export const createTestMessage = async (senderId, chatId, content = "Test message") => {
  const message = await Message.create({
    sender: senderId,
    chat: chatId,
    content,
    messageType: "text",
  });

  // Update chat's last message
  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

  return await Message.findById(message._id)
    .populate("sender", "username email avatar")
    .lean();
};

/**
 * Get auth headers for API requests
 */
export const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

