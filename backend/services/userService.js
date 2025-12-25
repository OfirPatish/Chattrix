import User from "../models/User.js";
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from "../errors/AppError.js";
import { getSkip, getPaginationMeta } from "../utils/pagination.js";

export const searchUsers = async (
  userId,
  searchQuery,
  page = 1,
  limit = 20
) => {
  // Validate search query length
  if (searchQuery && searchQuery.length > 100) {
    throw new BadRequestError("Search query cannot exceed 100 characters");
  }

  const skip = getSkip(page, limit);

  const keyword = searchQuery
    ? {
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      }
    : {};

  const query = {
    ...keyword,
    _id: { $ne: userId }, // Exclude current user
  };

  const [users, total] = await Promise.all([
    User.find(query)
      .select("username email avatar isOnline lastSeen")
      .limit(limit)
      .skip(skip)
      .sort({ username: 1 }),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: getPaginationMeta(total, page, limit, users.length),
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select(
    "username email avatar isOnline lastSeen createdAt"
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const updateUserProfile = async (userId, updates) => {
  const { username, avatar } = updates;

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (username !== undefined) {
    // Reject empty strings
    if (username.trim().length === 0) {
      throw new BadRequestError("Username cannot be empty");
    }
    // Check if username is already taken
    const usernameExists = await User.findOne({
      username,
      _id: { $ne: userId },
    });

    if (usernameExists) {
      throw new ConflictError("Username already taken");
    }

    user.username = username;
  }

  if (avatar !== undefined) {
    user.avatar = avatar;
  }

  await user.save();
  return user;
};
