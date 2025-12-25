import User from "../models/User.js";
import * as authService from "../services/authService.js";
import { sendSuccess, sendCreated } from "../utils/response.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.registerUser(username, email, password);

    return sendCreated(res, {
      ...result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    return sendSuccess(res, {
      ...result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    return sendSuccess(res, tokens);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (blacklist token)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { refreshToken } = req.body;
    await authService.logoutUser(token, refreshToken);
    return sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};
