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
    if (!origin) {
      console.log("✅ CORS: Request with no origin (allowed)");
      return callback(null, true);
    }

    // Log all CORS requests for debugging
    console.log(`🔍 CORS Check: Origin="${origin}", Expected="${frontendUrl}"`);

    // If FRONTEND_URL is set, only allow that origin (normalize URLs)
    if (frontendUrl) {
      const normalizedOrigin = origin.replace(/\/$/, ""); // Remove trailing slash
      const normalizedFrontendUrl = frontendUrl.replace(/\/$/, ""); // Remove trailing slash

      if (normalizedOrigin === normalizedFrontendUrl) {
        console.log("✅ CORS: Origin matched, allowing request");
        callback(null, true);
      } else {
        console.error(
          `❌ CORS Error: Origin "${origin}" not allowed. Expected: "${frontendUrl}"`
        );
        console.error(`   Normalized Origin: "${normalizedOrigin}"`);
        console.error(`   Normalized Expected: "${normalizedFrontendUrl}"`);
        callback(
          new Error(
            `CORS: Origin "${origin}" not allowed. Expected: "${frontendUrl}"`
          )
        );
      }
    } else {
      // Development: allow all origins
      console.log("⚠️  CORS: FRONTEND_URL not set, allowing all origins");
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
