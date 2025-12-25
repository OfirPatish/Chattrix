import express from "express";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  getChats,
  createChat,
  getChatById,
} from "../controllers/chatController.js";
import { validateObjectId } from "../utils/validators.js";
import { createChatValidators } from "../validators/chatValidators.js";

const router = express.Router();

router.get("/", protect, getChats);
router.post("/", protect, createChatValidators, validate, createChat);
router.get("/:chatId", protect, validateObjectId("chatId"), validate, getChatById);

export default router;
