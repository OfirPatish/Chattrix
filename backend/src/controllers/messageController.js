import User from "../models/User.js";
import Message from "../models/Message.js";

import { getUserSocketId, io } from "../lib/socket.js";
import { uploadImage } from "../lib/imgbb.js";

/**
 * Retrieves all available users for chat selection
 * Returns all users except the currently logged in user
 *
 * @route GET /api/messages/users
 */
export const getAvailableUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getAvailableUsers:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Retrieves conversation history between two users with pagination
 * Returns messages exchanged between the current user and specified user
 *
 * @route GET /api/messages/:id
 * @param {Object} req.query.page - Page number (default: 1)
 * @param {Object} req.query.limit - Number of messages per page (default: 25)
 */
export const getConversationHistory = async (req, res) => {
  try {
    const { id: recipientId } = req.params;
    const senderId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { senderId: senderId, receiverId: recipientId },
        { senderId: recipientId, receiverId: senderId },
      ],
    };

    // Get total count for pagination info
    const totalMessages = await Message.countDocuments(query);

    // We always sort messages newest-to-oldest (descending) for pagination purposes
    // Then reverse them before sending for proper display order
    const messages = await Message.find(query)
      .sort({ createdAt: -1 }) // Newest first for pagination
      .skip(skip)
      .limit(limit);

    // For proper conversation display, we need oldest messages first
    const messagesForClient = [...messages].reverse();

    // Calculate if there are more messages to load
    const hasMore = skip + messages.length < totalMessages;

    // Return messages with pagination info
    res.status(200).json({
      messages: messagesForClient,
      pagination: {
        total: totalMessages,
        page,
        limit,
        hasMore,
        skip,
        returned: messages.length,
      },
    });
  } catch (error) {
    console.error("Error in getConversationHistory:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Creates and sends a new message between users
 * Handles both text and image message types
 * Emits real-time notification via socket.io if recipient is online
 *
 * @route POST /api/messages/:id
 */
export const sendMessage = async (req, res) => {
  try {
    const { content, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to ImgBB
      const uploadResponse = await uploadImage(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getUserSocketId(receiverId);
    // Emit to the specific socket if they're online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    console.log(`Socket broadcast for message: ${newMessage._id} to room: ${receiverId}`);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
