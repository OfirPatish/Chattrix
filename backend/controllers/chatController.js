import * as chatService from "../services/chatService.js";
import { sendSuccess, sendCreated } from "../utils/response.js";

// @desc    Get all chats for current user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res, next) => {
  try {
    const chats = await chatService.getUserChats(req.user._id);
    return sendSuccess(res, chats);
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
    const { chat, isNew } = await chatService.getOrCreateChat(req.user._id, userId);

    if (isNew) {
      return sendCreated(res, chat);
    }
    return sendSuccess(res, chat);
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat by ID
// @route   GET /api/chats/:chatId
// @access  Private
export const getChatById = async (req, res, next) => {
  try {
    const chat = await chatService.getChatById(req.params.chatId, req.user._id);
    return sendSuccess(res, chat);
  } catch (error) {
    next(error);
  }
};
