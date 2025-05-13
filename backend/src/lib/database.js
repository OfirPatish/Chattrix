import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 *
 * Handles connection setup, error handling, and provides
 * appropriate logging based on environment
 *
 * @returns {Promise<void>}
 */
export const connectToMongoDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connection established");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit with failure on connection error
    process.exit(1);
  }
};
