import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    // Verify user is part of the chat
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username email avatar")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json({
      success: true,
      count: messages.length,
      page,
      pages: Math.ceil(
        (await Message.countDocuments({ chat: req.params.chatId })) / limit
      ),
      data: messages.reverse(), // Return in chronological order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new message
// @route   POST /api/messages
// @access  Private
export const createMessage = async (req, res, next) => {
  try {
    const { chatId, content, messageType, imageUrl } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and content are required",
      });
    }

    // Verify user is part of the chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content,
      messageType: messageType || "text",
      imageUrl: imageUrl || "",
    });

    // Update chat's last message
    chat.lastMessage = message._id;
    await chat.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "username email avatar"
    );

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
export const markMessageAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if already read by this user
    const alreadyRead = message.readBy.some(
      (read) => read.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        user: req.user._id,
        readAt: new Date(),
      });
      await message.save();
    }

    res.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    next(error);
  }
};
