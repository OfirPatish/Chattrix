import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/database.js";

// Load environment variables
dotenv.config();

// Realistic user data
const usersData = [
  {
    username: "alex_johnson",
    email: "alex.johnson@email.com",
    password: "password123",
  },
  {
    username: "sarah_martinez",
    email: "sarah.martinez@email.com",
    password: "password123",
  },
  {
    username: "michael_chen",
    email: "michael.chen@email.com",
    password: "password123",
  },
  {
    username: "emily_williams",
    email: "emily.williams@email.com",
    password: "password123",
  },
  {
    username: "david_brown",
    email: "david.brown@email.com",
    password: "password123",
  },
];

const generateUsers = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("🚀 Starting user generation...\n");

    const createdUsers = [];

    for (const userData of usersData) {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username }],
      });

      if (existingUser) {
        console.log(
          `⚠️  User ${userData.username} already exists, skipping...`
        );
        continue;
      }

      // Create user
      const user = await User.create(userData);
      createdUsers.push({
        _id: user._id,
        username: user.username,
        email: user.email,
        password: userData.password, // Show plain password for reference
      });

      console.log(`✅ Created user: ${user.username} (${user.email})`);
    }

    console.log("\n✨ User generation complete!\n");
    console.log("📋 Created Users Summary:");
    console.log("=".repeat(60));
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   ID: ${user._id}`);
      console.log("");
    });

    if (createdUsers.length === 0) {
      console.log("ℹ️  No new users created. All users already exist.");
    } else {
      console.log(`\n🎉 Successfully created ${createdUsers.length} user(s)!`);
    }

    // Close database connection
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error generating users:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
generateUsers();
