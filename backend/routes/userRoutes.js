import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  getUsers,
  getUserById,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.put(
  "/profile",
  protect,
  [
    body("username")
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),
  ],
  validate,
  updateProfile
);

export default router;
