import { body } from "express-validator";

/**
 * Registration validation rules
 */
export const registerValidators = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

/**
 * Login validation rules
 */
export const loginValidators = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Refresh token validation rules
 */
export const refreshTokenValidators = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required")
    .isString()
    .withMessage("Refresh token must be a string"),
];

