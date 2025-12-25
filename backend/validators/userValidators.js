import { body, query } from "express-validator";
import { paginationValidators } from "../utils/validators.js";

/**
 * Get users validation rules (includes pagination and search)
 */
export const getUsersValidators = [
  ...paginationValidators,
  query("search")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Search query cannot exceed 100 characters"),
];

/**
 * Update profile validation rules
 */
export const updateProfileValidators = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string")
    .isLength({ max: 10000 })
    .withMessage("Avatar URL/data cannot exceed 10000 characters"),
];

