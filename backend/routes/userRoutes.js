import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getUsers,
  getUserById,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.put("/profile", protect, updateProfile);

export default router;
