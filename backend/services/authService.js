import User from "../models/User.js";
import TokenBlacklist from "../models/TokenBlacklist.js";
import { generateTokens } from "../utils/generateToken.js";
import { generateRandomAvatar } from "../utils/generateAvatar.js";
import jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from "../errors/AppError.js";

export const registerUser = async (username, email, password) => {
  // Check if user already exists
  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    throw new ConflictError("User with this email or username already exists");
  }

  // Generate avatar for new user
  const avatar = generateRandomAvatar(username);

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    avatar,
  });

  const { accessToken, refreshToken } = generateTokens(user._id);

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email, password) => {
  // Find user and include password for comparison
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Update online status
  user.isOnline = true;
  user.lastSeen = new Date();
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user._id);

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }

  // Check if token is blacklisted
  const isBlacklisted = await TokenBlacklist.findOne({ token: refreshToken });
  if (isBlacklisted) {
    throw new UnauthorizedError("Token has been revoked");
  }

  // Verify refresh token
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );

  // Get user
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Generate new tokens
  return generateTokens(user._id);
};

export const logoutUser = async (accessToken, refreshToken) => {
  const tokensToBlacklist = [];

  if (accessToken) {
    const decoded = jwt.decode(accessToken);
    if (decoded && decoded.exp) {
      tokensToBlacklist.push({
        token: accessToken,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }
  }

  if (refreshToken) {
    const decoded = jwt.decode(refreshToken);
    if (decoded && decoded.exp) {
      tokensToBlacklist.push({
        token: refreshToken,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }
  }

  if (tokensToBlacklist.length > 0) {
    await TokenBlacklist.insertMany(tokensToBlacklist);
  }
};

