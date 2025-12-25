import express from "express";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { register, login, getMe, refreshToken, logout } from "../controllers/authController.js";
import {
  registerValidators,
  loginValidators,
  refreshTokenValidators,
} from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", authRateLimiter, registerValidators, validate, register);
router.post("/login", authRateLimiter, loginValidators, validate, login);
router.get("/me", protect, getMe);
router.post("/refresh", refreshTokenValidators, validate, refreshToken);
router.post("/logout", protect, logout);

export default router;
