import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
