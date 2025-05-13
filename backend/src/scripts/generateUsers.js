import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const generateRandomEmail = () => {
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
  const randomString = Math.random().toString(36).substring(2, 8);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${randomString}@${domain}`;
};

const generateRandomUsername = () => {
  const adjectives = ["Happy", "Clever", "Brave", "Gentle", "Wise", "Swift", "Bright", "Calm", "Daring", "Kind"];
  const nouns = ["Fox", "Bear", "Eagle", "Wolf", "Lion", "Tiger", "Dolphin", "Hawk", "Owl", "Panda"];
  const number = Math.floor(Math.random() * 1000);
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}${noun}${number}`;
};

const generateRandomAvatar = (seed) => {
  // Using DiceBear API with bottts style
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
};

const generateUsers = async (count = 10) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Generate users
    for (let i = 0; i < count; i++) {
      const email = generateRandomEmail();
      const username = generateRandomUsername();
      const password = "password123"; // Same password for all test users

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate avatar using username as seed for consistency
      const avatarUrl = generateRandomAvatar(username);

      const user = new User({
        email,
        username,
        password: hashedPassword,
        profilePic: avatarUrl,
      });

      await user.save();
      console.log(`Created user: ${username} (${email}) with avatar: ${avatarUrl}`);
    }

    console.log(`Successfully created ${count} users`);
    process.exit(0);
  } catch (error) {
    console.error("Error generating users:", error);
    process.exit(1);
  }
};

// Run the script
generateUsers(10);
