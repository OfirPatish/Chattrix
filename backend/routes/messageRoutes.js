import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getMessages,
  createMessage,
  markMessageAsRead,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:chatId", protect, getMessages);
router.post("/", protect, createMessage);
router.put("/:messageId/read", protect, markMessageAsRead);

export default router;
