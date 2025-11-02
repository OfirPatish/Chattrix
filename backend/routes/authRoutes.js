import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { register, login, getMe } from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.get("/me", protect, getMe);

export default router;
