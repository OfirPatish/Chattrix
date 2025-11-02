import Chat from "../models/Chat.js";

// @desc    Get all chats for current user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "username email avatar isOnline")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: chats.length,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or get one-on-one chat
// @route   POST /api/chats
// @access  Private
export const createChat = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] },
    })
      .populate("participants", "username email avatar isOnline")
      .populate("lastMessage");

    if (chat) {
      return res.json({
        success: true,
        data: chat,
      });
    }

    // Create new chat
    chat = await Chat.create({
      participants: [req.user._id, userId],
    });

    chat = await Chat.findById(chat._id)
      .populate("participants", "username email avatar isOnline")
      .populate("lastMessage");

    res.status(201).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat by ID
// @route   GET /api/chats/:chatId
// @access  Private
export const getChatById = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "username email avatar isOnline")
      .populate("lastMessage");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};
