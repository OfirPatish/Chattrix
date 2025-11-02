import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getChats,
  createChat,
  getChatById,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/", protect, getChats);
router.post("/", protect, createChat);
router.get("/:chatId", protect, getChatById);

export default router;
