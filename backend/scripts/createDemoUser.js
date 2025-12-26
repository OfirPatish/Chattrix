import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/database.js";

// Load environment variables
dotenv.config();

const createDemoUser = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("🚀 Creating demo user...\n");

    const demoUserData = {
      username: "demo",
      email: "demo@chattrix.com",
      password: "DemoUser123",
    };

    // Check if demo user already exists
    const existingUser = await User.findOne({
      $or: [{ email: demoUserData.email }, { username: demoUserData.username }],
    });

    if (existingUser) {
      console.log("⚠️  Demo user already exists!");
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   ID: ${existingUser._id}\n`);
      
      // Close database connection
      await mongoose.connection.close();
      console.log("✅ Database connection closed.");
      process.exit(0);
    }

    // Create demo user
    const user = await User.create(demoUserData);

    console.log("✅ Demo user created successfully!\n");
    console.log("📋 Demo Account Credentials:");
    console.log("=".repeat(50));
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${demoUserData.password}`);
    console.log(`ID: ${user._id}`);
    console.log("=".repeat(50));
    console.log("\n💡 Add these credentials to the README.md file.\n");

    // Close database connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating demo user:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
createDemoUser();

