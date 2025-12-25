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
      className={`flex gap-2 ${
        isOwn ? "flex-row-reverse" : "flex-row"
      } ${isGrouped ? "mb-1" : "mb-4"}`}
    >
      {/* Avatar - only show for received messages and when not grouped */}
      {!isOwn && (
        <div className="flex-shrink-0 w-8 h-8 mt-1">
          {showAvatar && !isGrouped ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary ring-2 ring-base-200" />
          ) : (
            <div className="w-8" />
          )}
        </div>
      )}

      {/* Message Container */}
      <div
        className={`flex flex-col ${
          isOwn ? "items-end" : "items-start"
        } max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%]`}
      >
        {/* Username - only for received messages */}
        {!isOwn && showAvatar && !isGrouped && (
          <div className="text-xs font-semibold text-base-content/70 mb-1 px-1">
            {message.sender?.username}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 shadow-sm ${
            isOwn
              ? "bg-primary text-primary-content rounded-br-sm"
              : "bg-base-100 text-base-content border border-base-300 rounded-bl-sm"
          } ${isGrouped && !isOwn ? "rounded-tl-sm" : ""} ${
            isGrouped && isOwn ? "rounded-tr-sm" : ""
          }`}
        >
          {message.imageUrl && (
            <div className="mb-2 -mx-4 -mt-2.5 first:mt-0 rounded-t-2xl overflow-hidden">
              <Image
                src={message.imageUrl}
                alt="Message"
                width={400}
                height={256}
                className="max-w-full rounded-t-2xl max-h-64 object-cover w-full"
                unoptimized={true}
              />
            </div>
          )}
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {message.content}
          </p>
          <div
            className={`flex items-center gap-1.5 mt-1.5 ${
              isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`text-[11px] font-medium ${
                isOwn ? "text-primary-content/70" : "text-base-content/50"
              }`}
            >
              {formatTime(message.createdAt)}
            </span>
            {isOwn && (
              <span className="flex-shrink-0">
                {isRead ? (
                  <CheckCheck className="w-3.5 h-3.5 text-primary-content/80" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-primary-content/60" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for own messages */}
      {isOwn && <div className="flex-shrink-0 w-8" />}
    </div>
  );
}

export default memo(MessageBubble);
