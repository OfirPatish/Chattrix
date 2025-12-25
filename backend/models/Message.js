import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [5000, 'Message content cannot exceed 5000 characters'],
      validate: {
        validator: function (v) {
          return v.trim().length > 0;
        },
        message: 'Message content cannot be empty',
      },
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
// Compound index for paginated message queries (most common query)
messageSchema.index({ chat: 1, createdAt: -1 });
// Index for finding messages by sender
messageSchema.index({ sender: 1 });
// Index for chat + createdAt (alternative for different sort orders)
messageSchema.index({ chat: 1, _id: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;

