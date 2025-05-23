import React from "react";

const MessageSkeleton = ({ count = 6 }) => {
  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 bg-base-100 rounded-lg border border-base-300">
      <div className="flex flex-col w-full">
        {/* Left messages (other user) */}
        <MessageItemSkeleton isCurrentUser={false} />

        {/* Right messages (current user) */}
        <MessageItemSkeleton isCurrentUser={true} />

        {/* Additional messages */}
        {Array.from({ length: count - 2 }, (_, i) => (
          <MessageItemSkeleton key={i} isCurrentUser={i % 2 === 0} />
        ))}
      </div>
    </div>
  );
};

const MessageItemSkeleton = ({ isCurrentUser }) => {
  return (
    <div className={`chat ${isCurrentUser ? "chat-end" : "chat-start"} animate-pulse mb-4`}>
      {!isCurrentUser && (
        <div className="chat-image avatar">
          <div className="w-10 h-10 rounded-full skeleton"></div>
        </div>
      )}

      <div className={`chat-bubble rounded-2xl ${isCurrentUser ? "chat-bubble-primary" : ""}`}>
        <div className="flex flex-col gap-2">
          <div className="skeleton h-3 w-24 sm:w-32 md:w-40"></div>
          <div className="skeleton h-3 w-32 sm:w-40 md:w-60"></div>
          {Math.random() > 0.5 && <div className="skeleton h-3 w-16 sm:w-24 md:w-32"></div>}
        </div>
        <div className="w-full flex justify-end mt-2">
          <div className="skeleton h-2 w-8"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
