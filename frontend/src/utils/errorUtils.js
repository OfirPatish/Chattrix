/**
 * Centralized error handling utility for API errors
 * Handles all error formats from the backend API
 */

/**
 * Extract error message from API error response
 * Handles validation errors (array format) and regular error messages
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @param {string} defaultMessage - Default message if no error found
 * @returns {string} - Formatted error message
 */
export const extractErrorMessage = (
  error,
  defaultMessage = "An error occurred"
) => {
  // Handle axios error response
  if (error?.response?.data) {
    const errorData = error.response.data;

    // Handle validation errors (array format) - 400/422 status codes
    if (
      errorData.errors &&
      Array.isArray(errorData.errors) &&
      errorData.errors.length > 0
    ) {
      // Join all validation error messages
      return errorData.errors
        .map((err) => err.msg || err.message || "Validation error")
        .join(", ");
    }

    // Handle regular error messages
    if (errorData.message) {
      return errorData.message;
    }

    // Handle error field (fallback)
    if (errorData.error) {
      return errorData.error;
    }
  }

  // Handle network errors or other error types
  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Extract validation errors by field name
 * Returns an object with field names as keys and error messages as values
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @returns {Object} - Object with field names as keys and error messages as values
 * Example: { username: "Username must be between 3 and 20 characters", email: "Invalid email format" }
 */
export const extractFieldErrors = (error) => {
  const fieldErrors = {};

  if (
    error?.response?.data?.errors &&
    Array.isArray(error.response.data.errors)
  ) {
    error.response.data.errors.forEach((err) => {
      const field = err.param || err.field || err.location;
      const message = err.msg || err.message || "Validation error";

      if (field) {
        // If multiple errors for same field, combine them
        if (fieldErrors[field]) {
          fieldErrors[field] = `${fieldErrors[field]}, ${message}`;
        } else {
          fieldErrors[field] = message;
        }
      }
    });
  }

  return fieldErrors;
};

/**
 * Get error message for a specific field
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @param {string} fieldName - Name of the field to get error for
 * @returns {string|null} - Error message for the field, or null if no error
 */
export const getFieldError = (error, fieldName) => {
  const fieldErrors = extractFieldErrors(error);
  return fieldErrors[fieldName] || null;
};

/**
 * Check if error is a validation error (400 or 422 status)
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @returns {boolean} - True if error is a validation error
 */
export const isValidationError = (error) => {
  const status = error?.response?.status;
  return status === 400 || status === 422;
};

/**
 * Check if error is an authentication error (401 status)
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @returns {boolean} - True if error is an authentication error
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401;
};

/**
 * Check if error is a forbidden error (403 status)
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @returns {boolean} - True if error is a forbidden error
 */
export const isForbiddenError = (error) => {
  return error?.response?.status === 403;
};

/**
 * Check if error is a not found error (404 status)
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @returns {boolean} - True if error is a not found error
 */
export const isNotFoundError = (error) => {
  return error?.response?.status === 404;
};

/**
 * Check if error is a conflict error (409 status)
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @returns {boolean} - True if error is a conflict error
 */
export const isConflictError = (error) => {
  return error?.response?.status === 409;
};

/**
 * Get user-friendly error message based on error type
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @param {Object} options - Options for error handling
 * @param {string} options.defaultMessage - Default message if no error found
 * @param {boolean} options.includeFieldNames - Include field names in validation errors
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyError = (error, options = {}) => {
  const { defaultMessage = "An error occurred", includeFieldNames = false } =
    options;

  // Handle validation errors with field names if requested
  if (isValidationError(error) && includeFieldNames) {
    const fieldErrors = extractFieldErrors(error);
    const fieldMessages = Object.entries(fieldErrors).map(
      ([field, message]) => `${field}: ${message}`
    );
    if (fieldMessages.length > 0) {
      return fieldMessages.join(", ");
    }
  }

  // Extract general error message
  return extractErrorMessage(error, defaultMessage);
};

/**
 * Format error for display in UI components
 * Returns an object with message and optional field-specific errors
 *
 * @param {Error|Object} error - Error object from axios or API response
 * @returns {Object} - Formatted error object
 * Example: { message: "Validation failed", fieldErrors: { username: "Too short" } }
 */
export const formatErrorForDisplay = (error) => {
  return {
    message: extractErrorMessage(error),
    fieldErrors: extractFieldErrors(error),
    isValidation: isValidationError(error),
    isAuth: isAuthError(error),
    isForbidden: isForbiddenError(error),
    isNotFound: isNotFoundError(error),
    isConflict: isConflictError(error),
    status: error?.response?.status || null,
  };
};
