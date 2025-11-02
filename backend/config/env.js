import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["MONGO_URL", "JWT_SECRET"];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(", ")}`
    );
    console.error("Please check your .env file");
    process.exit(1);
  }

  console.log("✅ Environment variables validated");
};

export default validateEnv;
