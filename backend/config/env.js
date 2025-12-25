import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["MONGO_URL", "JWT_SECRET"];

// Optional but recommended env vars
const recommendedEnvVars = ["JWT_REFRESH_SECRET"];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(", ")}`
    );
    console.error("Please check your .env file");
    process.exit(1);
  }

  // Validate MONGO_URL format
  if (process.env.MONGO_URL) {
    const mongoUrlPattern = /^mongodb(\+srv)?:\/\//;
    if (!mongoUrlPattern.test(process.env.MONGO_URL)) {
      console.error(
        "❌ Invalid MONGO_URL format. Must start with mongodb:// or mongodb+srv://"
      );
      process.exit(1);
    }
  }

  // Validate JWT_SECRET length (should be at least 32 characters for security)
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      "⚠️  JWT_SECRET is shorter than 32 characters. Consider using a longer secret for better security."
    );
  }

  // Require FRONTEND_URL in production
  if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_URL) {
    console.error(
      "❌ FRONTEND_URL is required in production for CORS security"
    );
    process.exit(1);
  }

  // Warn about recommended env vars (only in production)
  if (process.env.NODE_ENV === "production") {
    const missingRecommended = recommendedEnvVars.filter(
      (key) => !process.env[key]
    );
    if (missingRecommended.length > 0) {
      console.warn(
        `⚠️  Recommended environment variables not set: ${missingRecommended.join(
          ", "
        )}`
      );
    }
  }
};

export default validateEnv;
