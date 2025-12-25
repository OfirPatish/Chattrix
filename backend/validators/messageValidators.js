import { body, query } from "express-validator";
import { validateObjectIdBody, paginationValidators } from "../utils/validators.js";

/**
 * Create message validation rules
 */
export const createMessageValidators = [
  validateObjectIdBody("chatId", "Chat ID is required"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ max: 5000 })
    .withMessage("Message content cannot exceed 5000 characters"),
  body("messageType")
    .optional()
    .isIn(["text", "image", "file"])
    .withMessage("Invalid message type. Must be one of: text, image, file"),
  body("imageUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string")
    .isLength({ max: 2048 })
    .withMessage("Image URL cannot exceed 2048 characters"),
];

/**
 * Get messages validation rules (includes pagination)
 */
export const getMessagesValidators = [...paginationValidators];

