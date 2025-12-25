import { body } from "express-validator";
import { validateObjectIdBody } from "../utils/validators.js";

/**
 * Create chat validation rules
 */
export const createChatValidators = [
  validateObjectIdBody("userId", "User ID is required"),
];

