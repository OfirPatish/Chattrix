import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Path setup
const __dirname = path.resolve();

/**
 * Application configuration
 * Central configuration object for server settings
 */
const appConfig = {
  // Server configuration
  server: {
    port: process.env.PORT,
  },

  // CORS settings
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },

  // Cookie configuration
  cookie: {
    jwt: {
      httpOnly: true,
      sameSite: "lax", // Changed from strict to lax for cross-domain requests
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
};

export default appConfig;
