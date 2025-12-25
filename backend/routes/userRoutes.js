import express from "express";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  getUsers,
  getUserById,
  updateProfile,
} from "../controllers/userController.js";
import { validateObjectId } from "../utils/validators.js";
import {
  getUsersValidators,
  updateProfileValidators,
} from "../validators/userValidators.js";

const router = express.Router();

router.get("/", protect, getUsersValidators, validate, getUsers);
router.get("/:id", protect, validateObjectId("id"), validate, getUserById);
router.put(
  "/profile",
  protect,
  updateProfileValidators,
  validate,
  updateProfile
);

export default router;
