/**
 * Standardized API response utility
 */

/**
 * Send success response
 * @param {object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data, message = null, statusCode = 200) => {
  const response = {
    success: true,
    ...(message && { message }),
    ...(data && { data }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 */
export const sendError = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Send paginated response
 * @param {object} res - Express response object
 * @param {array} data - Array of items
 * @param {object} pagination - Pagination metadata
 */
export const sendPaginated = (res, data, pagination) => {
  return res.json({
    success: true,
    ...pagination,
    data,
  });
};

/**
 * Send created response
 * @param {object} res - Express response object
 * @param {*} data - Created resource data
 * @param {string} message - Optional success message
 */
export const sendCreated = (res, data, message = null) => {
  return sendSuccess(res, data, message, 201);
};

