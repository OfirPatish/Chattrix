import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getConversationHistory, getAvailableUsers, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

// Get all available users to chat with
router.get("/users", protectRoute, getAvailableUsers);

// Get conversation history with a specific user
router.get("/:id", protectRoute, getConversationHistory);

// Send a message to a specific user
router.post("/:id", protectRoute, sendMessage);

export default router;
