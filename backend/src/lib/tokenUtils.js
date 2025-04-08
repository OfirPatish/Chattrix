import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";

/**
 * Generate JWT token and set in HTTP-only cookie
 * @param {string} userId - User ID to encode in token
 * @param {object} res - Express response object
 * @returns {string} Generated token
 */
export const generateToken = (userId, res) => {
  // Create JWT with user ID
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set secure HTTP-only cookie using centralized configuration
  res.cookie("jwt", token, appConfig.cookie.jwt);

  return token;
};
