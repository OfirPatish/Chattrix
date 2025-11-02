import { User } from "lucide-react";

export const getChatName = (chat, currentUserId) => {
  const otherUser = chat.participants?.find((p) => p._id !== currentUserId);
  return otherUser?.username || "Unknown User";
};

export const getChatAvatar = (chat, currentUserId) => {
  return User;
};

export const getLastMessage = (chat) => {
  if (!chat.lastMessage) return "No messages yet";
  const message = chat.lastMessage;
  if (message.content) {
    return message.content.length > 30
      ? message.content.substring(0, 30) + "..."
      : message.content;
  }
  return "📎 Media";
};

export const formatTime = (date) => {
  if (!date) return "";
  const messageDate = new Date(date);
  const now = new Date();
  const diff = now - messageDate;
  const hours = diff / (1000 * 60 * 60);

  if (hours < 24) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (hours < 168) {
    return messageDate.toLocaleDateString([], { weekday: "short" });
  } else {
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }
};

export const shouldShowAvatar = (message, prevMessage, currentUserId) => {
  if (message.sender._id === currentUserId) return false;
  if (!prevMessage) return true;
  if (prevMessage.sender._id !== message.sender._id) return true;
  const timeDiff =
    new Date(message.createdAt) - new Date(prevMessage.createdAt);
  return timeDiff > 300000; // 5 minutes
};

export const shouldGroupWithPrevious = (
  message,
  prevMessage,
  currentUserId
) => {
  if (!prevMessage) return false;
  // Group if same sender (for both own and other messages)
  if (message.sender._id !== prevMessage.sender._id) return false;
  const timeDiff =
    new Date(message.createdAt) - new Date(prevMessage.createdAt);
  // Group messages sent within 2 minutes of each other
  return timeDiff < 120000; // 2 minutes
};

export const formatMessageDate = (date) => {
  if (!date) return "";
  const messageDate = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const messageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );

  if (messageDay.getTime() === today.getTime()) {
    return "Today";
  } else if (messageDay.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};
