import mongoose from "mongoose";

/**
 * Message Schema
 * Defines the structure for message documents exchanged between users
 *
 * @property {ObjectId} senderId - Reference to the User who sent the message
 * @property {ObjectId} receiverId - Reference to the User receiving the message
 * @property {String} content - Text content of the message (optional if image)
 * @property {String} imageUrl - URL to attached image (optional)
 * @property {Date} createdAt - Timestamp when message was sent
 * @property {Date} updatedAt - Timestamp of last update
 */
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
