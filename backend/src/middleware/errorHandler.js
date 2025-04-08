/**
 * Global error handling middleware
 * Catches and formats all errors passed to next()
 */
export const errorHandler = (err, req, res, next) => {
  // Get status code from error or default to 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error for debugging
  console.error(err);

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: err.stack,
  });
};
