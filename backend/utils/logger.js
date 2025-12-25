import pino from "pino";

// Create logger instance
const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "info"),
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: true,
            hideObject: false,
            messageFormat: "{msg}",
          },
        }
      : undefined,
});

export default logger;

