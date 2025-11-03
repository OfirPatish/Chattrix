"use client";

import { memo } from "react";
import Image from "next/image";
import { CheckCheck, Check } from "lucide-react";
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
      {!isOwn && showAvatar && (
        <div className="chat-header text-xs text-base-content/60 mb-1 px-2 font-medium truncate">
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
        <div
          className={`flex items-center gap-1 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-[11px] opacity-70 ${
              isOwn ? "text-primary-content/70" : "text-base-content/60"
            }`}
          >
            {formatTime(message.createdAt)}
          </span>
          {isOwn && (
            <span className="flex-shrink-0">
              {isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-primary-content/70" />
              ) : (
                <Check className="w-3.5 h-3.5 text-primary-content/50" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MessageBubble);
