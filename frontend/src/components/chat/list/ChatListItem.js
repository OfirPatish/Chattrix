"use client";

import { memo } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import { getChatName, getLastMessage, formatTime } from "@/utils/chatHelpers";
import { getAvatarUrl } from "@/utils/avatarUtils";

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
      className={`w-full text-left px-3 py-3 transition-all duration-150 ${
        isActive
          ? "bg-primary/10 border-l-4 border-l-primary"
          : "hover:bg-base-200/50 border-l-4 border-l-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="avatar placeholder relative flex-shrink-0">
          {getAvatarUrl(otherUser?.avatar, otherUser?.username) ? (
            <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-base-300">
              <Image
                src={getAvatarUrl(otherUser?.avatar, otherUser?.username)}
                alt={otherUser?.username || "Avatar"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center ring-1 ring-base-300">
              <User className="h-6 w-6" />
            </div>
          )}
          {otherUser?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={`font-semibold text-sm truncate ${
                isActive ? "text-primary" : "text-base-content"
              }`}
            >
              {getChatName(chat, currentUserId)}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {chat.lastMessage && (
                <span className="text-xs text-base-content/50">
                  {formatTime(chat.lastMessage.createdAt)}
                </span>
              )}
              {unreadCount > 0 && (
                <span className="badge badge-primary badge-xs min-w-[18px] h-4.5 px-1 font-bold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </div>
          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? "text-base-content font-medium"
                : "text-base-content/60"
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
