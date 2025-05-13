import mongoose from "mongoose";

/**
 * User Schema
 * Defines the structure for user documents in the database
 *
 * @property {String} email - User's email address (unique)
 * @property {String} username - User's display name
 * @property {String} password - User's hashed password
 * @property {String} profilePic - URL to user's profile picture
 * @property {Date} createdAt - Timestamp of account creation
 * @property {Date} updatedAt - Timestamp of last update
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
