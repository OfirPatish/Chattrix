import cors from "cors";

// CORS configuration - when credentials: true, cannot use "*" for origin
const frontendUrl = process.env.FRONTEND_URL;

// Normalize URL helper - removes trailing slash and ensures consistent format
const normalizeUrl = (url) => {
  if (!url) return null;
  return url.replace(/\/$/, "").toLowerCase();
};

// Validate that if credentials are needed, origin must be specified
if (!frontendUrl) {
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "⚠️  FRONTEND_URL not set in production - CORS will allow all origins"
    );
  } else {
    // Only log once in development, not on every request
    console.log(
      "⚠️  CORS: FRONTEND_URL not set, allowing all origins (development mode)"
    );
  }
} else {
  const normalized = normalizeUrl(frontendUrl);
  console.log(`✅ CORS: Frontend URL configured: ${normalized}`);
}

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // If FRONTEND_URL is not set, allow all origins
    if (!frontendUrl) {
      return callback(null, true);
    }

    // Normalize both URLs for comparison (case-insensitive, no trailing slash)
    const normalizedOrigin = normalizeUrl(origin);
    const normalizedFrontendUrl = normalizeUrl(frontendUrl);

    if (normalizedOrigin === normalizedFrontendUrl) {
      callback(null, true);
    } else {
      // Log detailed error for debugging
      console.error(
        `❌ CORS Error: Origin "${origin}" not allowed. Expected: "${frontendUrl}"`
      );
      console.error(`   Normalized Origin: "${normalizedOrigin}"`);
      console.error(`   Normalized Expected: "${normalizedFrontendUrl}"`);
      console.error(
        `   Match failed. Please verify FRONTEND_URL environment variable on Render.`
      );
      callback(
        new Error(
          `CORS: Origin "${origin}" not allowed. Expected: "${frontendUrl}"`
        )
      );
    }
  },
  credentials: !!frontendUrl, // Only enable if origin is specified
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false,
};

export const socketCorsOptions = {
  origin: frontendUrl || "*",
  methods: ["GET", "POST"],
  credentials: !!frontendUrl,
};

export default cors(corsOptions);
