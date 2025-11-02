"use client";

import { memo } from "react";
import Image from "next/image";
import { CheckCheck, Check, User } from "lucide-react";
import useAuthStore from "@/store/authStore";

function MessageBubble({ message, showAvatar, isGrouped }) {
  const { user } = useAuthStore();
  const isOwn = message.sender._id === user?._id;

  // Format timestamp like WhatsApp (HH:MM)
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Check if message is read
  const isRead = message.readBy?.some(
    (r) => r.user?._id !== user?._id || r.user !== user?._id
  );

  return (
    <div
      className={`chat ${isOwn ? "chat-end" : "chat-start"} ${
        isGrouped ? "mb-0.5" : "mb-2"
      }`}
    >
      {!isOwn && (
        <div className="chat-image avatar">
          {showAvatar ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-base-content flex items-center justify-center shadow-sm">
              <User className="h-4 w-4" />
            </div>
          ) : (
            <div className="w-8"></div>
          )}
        </div>
      )}
      {!isOwn && showAvatar && (
        <div className="chat-header text-xs text-base-content/60 mb-1 px-2 font-medium">
          {message.sender?.username}
        </div>
      )}
      <div
        className={`chat-bubble ${
          isOwn
            ? "chat-bubble-primary"
            : "bg-base-100 text-base-content border border-base-300"
        }`}
      >
        {message.imageUrl && (
          <Image
            src={message.imageUrl}
            alt="Message"
            width={400}
            height={256}
            className="max-w-full rounded-xl mb-2 max-h-64 object-cover"
            unoptimized
          />
        )}
        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
          {message.content}
        </p>
      </div>
      {isOwn && (
        <div className="chat-image avatar">
          <div className="w-8"></div>
        </div>
      )}
      <div className="chat-footer text-[11px] flex items-center gap-1 opacity-70">
        <span className="text-base-content/60">
          {formatTime(message.createdAt)}
        </span>
        {isOwn && (
          <span className="flex-shrink-0">
            {isRead ? (
              <CheckCheck className="w-3.5 h-3.5 text-info" />
            ) : (
              <Check className="w-3.5 h-3.5 text-base-content/50" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble);
