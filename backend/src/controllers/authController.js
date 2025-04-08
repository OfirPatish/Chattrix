import { generateToken } from "../lib/tokenUtils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import appConfig from "../config/appConfig.js";

/**
 * User registration endpoint
 * Creates a new user account and returns user data with authentication token
 */
export const register = async (req, res) => {
  const { username, email, password, profilePic } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with provided profile pic or default
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePic: profilePic || "",
    });

    if (newUser) {
      // Generate authentication token
      generateToken(newUser._id, res);
      await newUser.save();

      // Return user data without password
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      console.log(`User created: ${newUser._id}`);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in register controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * User authentication endpoint
 * Validates credentials and returns user data with authentication token
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate authentication token
    generateToken(user._id, res);

    // Return user data without password
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });

    console.log(`Login successful: ${user._id}`);
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * User logout endpoint
 * Clears the JWT cookie to terminate the session
 *
 * @route POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    // Use the same cookie settings but with immediate expiration
    const cookieOptions = {
      ...appConfig.cookie.jwt,
      maxAge: 0,
    };

    res.cookie("jwt", "", cookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Profile update endpoint
 * Updates user profile with DiceBear avatar and/or username
 *
 * @route PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, username } = req.body;
    const userId = req.user._id;

    // Create update object
    const updateData = {};

    // Add profilePic to update data if provided
    if (profilePic) {
      // For avatar updates, use the DiceBear data URI directly
      updateData.profilePic = profilePic;
    }

    // Add username to update data if provided
    if (username) {
      // Case-insensitive check if username is already taken by another user
      const existingUser = await User.findOne({
        username: { $regex: new RegExp(`^${username}$`, "i") },
        _id: { $ne: userId }, // Exclude current user from check
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }

      updateData.username = username;
    }

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    // Update user with the provided data
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

    res.status(200).json(updatedUser);

    console.log(`User updated: ${updatedUser._id}`);
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Authentication verification endpoint
 * Verifies user's authentication status and returns user data
 *
 * @route GET /api/auth/verify
 */
export const verifyAuthentication = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in verifyAuthentication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
