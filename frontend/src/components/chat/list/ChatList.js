"use client";

import { useEffect } from "react";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import ChatListItem from "./ChatListItem";
import ChatListSkeleton from "./ChatListSkeleton";
import EmptyState from "../EmptyState";
import { useSocket } from "@/hooks/useSocket";
import { MessageCircle } from "lucide-react";

export default function ChatList({ onCloseMobile, onNewChat }) {
  const {
    chats,
    currentChat,
    setCurrentChat,
    fetchChats,
    messages,
    error,
    hasInitiallyFetched,
  } = useChatStore();
  const { user } = useAuthStore();
  const { isConnected } = useSocket();

  useEffect(() => {
    // Only fetch once if initial fetch hasn't been attempted yet
    // Don't check isLoading here - we only care about hasInitiallyFetched
    if (!hasInitiallyFetched) {
      fetchChats();
    }
  }, [hasInitiallyFetched, fetchChats]);

  const handleChatClick = (chat) => {
    setCurrentChat(chat);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      {/* Compact Header */}
      <div className="px-4 py-4 border-b border-base-300 bg-base-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-base-content">Chats</h2>
          {/* Connection Status */}
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-success" : "bg-warning animate-pulse"
            }`}
            title={isConnected ? "Connected" : "Connecting"}
          />
        </div>
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="btn btn-primary btn-sm w-full gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
        {!hasInitiallyFetched ? (
          <ChatListSkeleton count={5} />
        ) : error ? (
          <EmptyState
            icon={<MessageCircle className="h-16 w-16 text-base-content/40" />}
            title="Error loading chats"
            description={error}
          />
        ) : chats.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="h-16 w-16 text-base-content/40" />}
            title="No conversations yet"
            description="Start a new chat to begin messaging"
          />
        ) : (
          <div className="py-2">
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
