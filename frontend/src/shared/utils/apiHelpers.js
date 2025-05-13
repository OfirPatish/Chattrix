import toast from "react-hot-toast";

/**
 * Handles API errors consistently across the application
 *
 * @param {Error} error The error object from the API call
 * @param {Object} options Options for error handling
 * @param {boolean} options.silent Whether to show a toast notification
 * @param {string} options.fallbackMessage Default message if error doesn't have one
 */
export const handleApiError = (error, { silent = false, fallbackMessage = "An error occurred" } = {}) => {
  // Skip notification for silent errors
  if (error.silent || silent) {
    return;
  }

  // Extract error message from response or use fallback
  const errorMessage = error.response?.data?.message || fallbackMessage;
  toast.error(errorMessage);

  // Return the error message for potential use in UI
  return errorMessage;
};

/**
 * Creates a standardized API request handler with proper error management
 *
 * @param {Function} apiCall Async function that makes the API request
 * @param {Object} options Error handling options
 * @returns {Function} Wrapped API call function with standardized error handling
 */
export const createApiHandler = (apiCall, options = {}) => {
  return async (...args) => {
    try {
      return await apiCall(...args);
    } catch (error) {
      handleApiError(error, options);
      throw error; // Re-throw for component-level handling if needed
    }
  };
};
