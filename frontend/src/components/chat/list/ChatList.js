"use client";

import { useEffect } from "react";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import ChatListItem from "./ChatListItem";
import ChatListSkeleton from "./ChatListSkeleton";
import EmptyState from "../EmptyState";
import { useSocket } from "@/hooks/useSocket";
import { X, MessageCircle, Wifi, WifiOff } from "lucide-react";

export default function ChatList({ onCloseMobile, onNewChat }) {
  const {
    chats,
    currentChat,
    setCurrentChat,
    fetchChats,
    isLoading,
    messages,
  } = useChatStore();
  const { user } = useAuthStore();
  const { isConnected } = useSocket();

  useEffect(() => {
    // Only fetch if chats haven't been loaded yet
    if (chats.length === 0 && !isLoading) {
      fetchChats();
    }
  }, [fetchChats, chats.length, isLoading]);

  const handleChatClick = (chat) => {
    setCurrentChat(chat);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      <div className="px-5 py-4 border-b border-base-300 bg-base-100/50 backdrop-blur-sm">
        <div className="flex items-center justify-between h-11">
          <h2 className="text-base font-semibold">Messages</h2>
          <div className="flex items-center gap-2">
            {/* Connection Status Indicator */}
            <div
              className={`badge gap-1.5 px-2.5 py-1.5 transition-all ${
                isConnected
                  ? "badge-success badge-outline"
                  : "badge-warning badge-outline"
              }`}
            >
              {isConnected ? (
                <Wifi className="h-3.5 w-3.5" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 animate-pulse" />
              )}
              <span className="text-xs font-medium hidden sm:inline">
                {isConnected ? "Connected" : "Connecting"}
              </span>
            </div>
            {onCloseMobile && (
              <button
                className="btn btn-ghost btn-sm btn-circle lg:hidden"
                onClick={onCloseMobile}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && chats.length === 0 ? (
          <ChatListSkeleton count={3} />
        ) : chats.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="h-12 w-12 text-base-content/40" />}
            title="No conversations yet"
            description="Start a new chat to begin"
          />
        ) : (
          <div className="divide-y divide-base-200">
            {chats.map((chat) => {
              const chatMessages = messages[chat._id] || [];
              const userId = user?._id;
              const unreadCount = chatMessages.filter(
                (msg) =>
                  (msg.sender?._id || msg.sender) !== userId &&
                  !msg.readBy?.some((r) => (r.user?._id || r.user) === userId)
              ).length;

              return (
                <ChatListItem
                  key={chat._id}
                  chat={chat}
                  isActive={currentChat?._id === chat._id}
                  currentUserId={userId}
                  unreadCount={unreadCount}
                  onClick={() => handleChatClick(chat)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

