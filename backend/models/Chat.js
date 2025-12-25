import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: function (v) {
          // Ensure exactly 2 participants for one-on-one chats
          return v.length === 2;
        },
        message: "A chat must have exactly 2 participants",
      },
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
// Compound index for finding user chats sorted by update time
chatSchema.index({ participants: 1, updatedAt: -1 });
// Index for finding chats by specific participants (for createChat)
chatSchema.index({ participants: 1 });
// Index for sorting chats by update time
chatSchema.index({ updatedAt: -1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
