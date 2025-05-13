import express from "express";
import { verifyAuthentication, login, logout, register, updateProfile } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.put("/profile", protectRoute, updateProfile);
router.get("/verify", protectRoute, verifyAuthentication);

export default router;
