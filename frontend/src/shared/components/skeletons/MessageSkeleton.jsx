import React from "react";

const MessageSkeleton = ({ count = 1 }) => {
  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4">
      <div className="space-y-6">
        {Array.from({ length: count }, (_, i) => (
          <MessageItemSkeleton key={i} isLeft={true} />
        ))}
      </div>
    </div>
  );
};

const MessageItemSkeleton = ({ isLeft }) => {
  const alignment = isLeft ? "items-start" : "items-end";

  return (
    <div className={`flex flex-col w-full ${alignment} animate-pulse`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 bg-base-300 rounded-full"></div>
        <div className="h-3 w-16 bg-base-300 rounded"></div>
      </div>

      <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} w-full`}>
        <div className="max-w-[65%] p-3 rounded-lg bg-base-300 overflow-hidden">
          <div className="h-3 w-24 bg-base-200 rounded mb-2"></div>
          <div className="h-3 w-36 bg-base-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
