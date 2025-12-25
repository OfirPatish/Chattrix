import express from "express";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  getMessages,
  createMessage,
  markMessageAsRead,
} from "../controllers/messageController.js";
import { validateObjectId } from "../utils/validators.js";
import {
  createMessageValidators,
  getMessagesValidators,
} from "../validators/messageValidators.js";

const router = express.Router();

router.get(
  "/:chatId",
  protect,
  validateObjectId("chatId"),
  getMessagesValidators,
  validate,
  getMessages
);

router.post("/", protect, createMessageValidators, validate, createMessage);

router.put(
  "/:messageId/read",
  protect,
  validateObjectId("messageId"),
  validate,
  markMessageAsRead
);

export default router;
