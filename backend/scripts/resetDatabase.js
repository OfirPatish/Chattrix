import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import TokenBlacklist from "../models/TokenBlacklist.js";
import connectDB from "../config/database.js";

// Load environment variables
dotenv.config();

const resetDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("🗑️  Starting database reset...\n");

    // Delete all documents from all collections
    const userResult = await User.deleteMany({});
    const chatResult = await Chat.deleteMany({});
    const messageResult = await Message.deleteMany({});
    const tokenResult = await TokenBlacklist.deleteMany({});

    console.log("✅ Deleted documents:");
    console.log(`   - Users: ${userResult.deletedCount}`);
    console.log(`   - Chats: ${chatResult.deletedCount}`);
    console.log(`   - Messages: ${messageResult.deletedCount}`);
    console.log(`   - Blacklisted Tokens: ${tokenResult.deletedCount}`);

    console.log("\n✨ Database reset complete!");
    console.log("📦 Database is now clean and ready for new data.\n");

    // Close database connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
resetDatabase();

