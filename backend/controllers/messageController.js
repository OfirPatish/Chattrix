import * as messageService from "../services/messageService.js";
import * as chatService from "../services/chatService.js";
import { sendSuccess, sendCreated, sendPaginated } from "../utils/response.js";
import { normalizePagination } from "../utils/validators.js";

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    // Verify user is part of the chat
    await chatService.verifyChatAccess(req.params.chatId, req.user._id);

    // Normalize pagination parameters
    const { page, limit } = normalizePagination(req.query, 50);

    const { messages, pagination } = await messageService.getChatMessages(
      req.params.chatId,
      page,
      limit
    );

    return sendPaginated(res, messages, pagination);
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

    const message = await messageService.createMessage(
      req.user._id,
      chatId,
      content,
      messageType,
      imageUrl
    );

    return sendCreated(res, message);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
export const markMessageAsRead = async (req, res, next) => {
  try {
    await messageService.markMessageAsRead(req.params.messageId, req.user._id);
    return sendSuccess(res, null, "Message marked as read");
  } catch (error) {
    next(error);
  }
};
