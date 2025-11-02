import User from "../models/User.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id }, // Exclude current user
    }).select("username email avatar isOnline lastSeen");

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username email avatar isOnline lastSeen createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
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

    const user = await User.findById(req.user._id);

    if (username) {
      // Check if username is already taken
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });

      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }

      user.username = username;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
