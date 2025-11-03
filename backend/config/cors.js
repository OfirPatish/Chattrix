import cors from "cors";

// CORS configuration - when credentials: true, cannot use "*" for origin
const frontendUrl = process.env.FRONTEND_URL;

// Validate that if credentials are needed, origin must be specified
if (!frontendUrl && process.env.NODE_ENV === "production") {
  console.warn(
    "⚠️  FRONTEND_URL not set in production - CORS credentials disabled"
  );
}

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // If FRONTEND_URL is set, only allow that origin (normalize URLs)
    if (frontendUrl) {
      const normalizedOrigin = origin.replace(/\/$/, ""); // Remove trailing slash
      const normalizedFrontendUrl = frontendUrl.replace(/\/$/, ""); // Remove trailing slash

      if (normalizedOrigin === normalizedFrontendUrl) {
        callback(null, true);
      } else {
        console.error(
          `❌ CORS Error: Origin "${origin}" not allowed. Expected: "${frontendUrl}"`
        );
        callback(new Error(`CORS: Origin not allowed`));
      }
    } else {
      // Development: allow all origins
      callback(null, true);
    }
  },
  credentials: !!frontendUrl, // Only enable if origin is specified
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false,
};

export const socketCorsOptions = {
  origin: frontendUrl || "*",
  methods: ["GET", "POST"],
  credentials: !!frontendUrl,
};

export default cors(corsOptions);
