import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const deleteUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Find the first user
    const firstUser = await User.findOne().sort({ createdAt: 1 });

    if (!firstUser) {
      console.log("No users found in the database");
      process.exit(0);
    }

    // Delete all users except the first one
    const result = await User.deleteMany({ _id: { $ne: firstUser._id } });

    console.log(`Successfully deleted ${result.deletedCount} users`);
    console.log(`Kept user: ${firstUser.username} (${firstUser.email})`);

    process.exit(0);
  } catch (error) {
    console.error("Error deleting users:", error);
    process.exit(1);
  }
};

// Run the script
deleteUsers();
