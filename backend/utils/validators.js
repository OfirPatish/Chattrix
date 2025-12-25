import mongoose from "mongoose";
import { param, body, query } from "express-validator";

/**
 * Validates MongoDB ObjectId for route parameters
 * @param {string} paramName - Name of the parameter to validate
 * @returns {object} Express validator middleware
 */
export const validateObjectId = (paramName) => {
  return param(paramName).custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`Invalid ${paramName}`);
    }
    return true;
  });
};

/**
 * Validates MongoDB ObjectId for request body
 * @param {string} fieldName - Name of the field to validate
 * @param {string} customMessage - Custom error message (optional)
 * @returns {object} Express validator middleware
 */
export const validateObjectIdBody = (fieldName, customMessage = null) => {
  return body(fieldName)
    .notEmpty()
    .withMessage(customMessage || `${fieldName} is required`)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(customMessage || `Invalid ${fieldName}`);
      }
      return true;
    });
};

/**
 * Pagination query validators
 * @returns {array} Array of express validator middlewares
 */
export const paginationValidators = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

/**
 * Normalize pagination parameters
 * @param {object} query - Express query object
 * @param {number} defaultLimit - Default limit if not provided
 * @returns {object} Normalized pagination object with page and limit
 */
export const normalizePagination = (query, defaultLimit = 20) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(query.limit) || defaultLimit)
  );
  return { page, limit };
};
