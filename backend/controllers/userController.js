import * as userService from "../services/userService.js";
import { sendSuccess, sendPaginated } from "../utils/response.js";
import { normalizePagination } from "../utils/validators.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res, next) => {
  try {
    // Normalize pagination parameters
    const { page, limit } = normalizePagination(req.query, 20);

    const { users, pagination } = await userService.searchUsers(
      req.user._id,
      req.query.search,
      page,
      limit
    );

    return sendPaginated(res, users, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;
    const user = await userService.updateUserProfile(req.user._id, {
      username,
      avatar,
    });
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};
