"use client";

import { memo } from "react";
import { User } from "lucide-react";
import { getChatName, getLastMessage, formatTime } from "@/utils/chatHelpers";

function ChatListItem({
  chat,
  isActive,
  currentUserId,
  unreadCount = 0,
  onClick,
}) {
  const otherUser = chat.participants?.find((p) => p._id !== currentUserId);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 transition-all duration-200 active:scale-[0.98] ${
        isActive
          ? "bg-primary/10 border-l-4 border-l-primary"
          : "hover:bg-base-200/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="avatar placeholder relative">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${
              isActive
                ? "bg-gradient-to-br from-primary to-secondary text-primary-content ring-2 ring-primary/30"
                : "bg-gradient-to-br from-base-300 to-base-300 text-base-content"
            }`}
          >
            <User className="h-6 w-6" />
          </div>
          {otherUser?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success border-2 border-base-100 rounded-full"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2">
            <h3
              className={`font-semibold text-sm truncate ${
                isActive ? "text-primary" : ""
              }`}
            >
              {getChatName(chat, currentUserId)}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {chat.lastMessage && (
                <span className="text-xs text-base-content/60">
                  {formatTime(chat.lastMessage.createdAt)}
                </span>
              )}
              {unreadCount > 0 && (
                <span className="badge badge-primary badge-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </div>
          <p
            className={`text-sm truncate ${
              unreadCount > 0
                ? "text-base-content font-medium"
                : "text-base-content/70"
            }`}
          >
            {getLastMessage(chat)}
          </p>
        </div>
      </div>
    </button>
  );
}

export default memo(ChatListItem);
