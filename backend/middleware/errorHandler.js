import logger from "../utils/logger.js";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with more context using structured logging
  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
        name: err.name,
        statusCode: err.statusCode,
      },
      req: {
        path: req.path,
        method: req.method,
        ip: req.ip,
      },
    },
    "Request error"
  );

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = { message: "Resource not found", statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = { message: "Duplicate field value entered", statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = { message: "Invalid token", statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    error = { message: "Token expired", statusCode: 401 };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message || "Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
