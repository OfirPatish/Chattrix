"use client";

import { useEffect, useRef, useMemo } from "react";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import { useSocket } from "@/hooks/useSocket";
import { useMessageScroll } from "@/hooks/useMessageScroll";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import ChatHeader from "../ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageSkeleton from "./MessageSkeleton";
import EmptyState from "../EmptyState";
import {
  shouldShowAvatar,
  shouldGroupWithPrevious,
  formatMessageDate,
} from "@/utils/chatHelpers";
import { MessageCircle, Mail } from "lucide-react";
import LoadingIndicator from "@/components/common/LoadingIndicator";

export default function MessageList({ onNewChat }) {
  const {
    currentChat,
    messages,
    pagination,
    isLoading,
    isLoadingMore,
    fetchMessages,
    fetchChatById,
    loadMoreMessages,
  } = useChatStore();
  const { user } = useAuthStore();
  const { joinChat, markAsRead } = useSocket();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const previousChatIdRef = useRef(null);
  const scrollStateRef = useRef({
    scrollHeight: 0,
    lastMessageCount: 0,
    isInitialLoad: false,
    justLoadedOlder: false,
    firstMessageId: null,
  });

  // Handle chat switching and initial scroll
  useEffect(() => {
    const chatId = currentChat?._id;
    if (!chatId || chatId === previousChatIdRef.current) {
      if (!chatId) previousChatIdRef.current = null;
      return;
    }

    previousChatIdRef.current = chatId;
    scrollStateRef.current.lastMessageCount = 0;
    scrollStateRef.current.firstMessageId = null;

    fetchChatById(chatId);
    joinChat(chatId);

    const existingMessages = messages[chatId];
    if (existingMessages?.length > 0) {
      // Messages exist, scroll to bottom after render
      scrollStateRef.current.isInitialLoad = true;
      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
          scrollStateRef.current.isInitialLoad = false;
        }
      });
    } else {
      // Fetch messages
      scrollStateRef.current.isInitialLoad = true;
      fetchMessages(chatId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?._id]);

  // Use custom hooks for scroll management
  useMessageScroll({
    messagesContainerRef,
    messagesEndRef,
    chatMessages: messages[currentChat?._id],
    isLoadingMore,
    currentChatId: currentChat?._id,
    userId: user?._id,
    scrollStateRef,
  });

  useInfiniteScroll({
    messagesContainerRef,
    currentChatId: currentChat?._id,
    pagination,
    isLoadingMore,
    loadMoreMessages,
    scrollStateRef,
    messages,
  });

  // Get chat messages (must be before conditional returns for Rules of Hooks)
  // Memoize to prevent new array reference on every render
  const chatMessages = useMemo(() => {
    return messages[currentChat?._id] || [];
  }, [messages, currentChat?._id]);

  const paginationData = pagination[currentChat?._id];
  const hasMore = paginationData?.hasMore;

  // Memoize message rendering data to prevent unnecessary recalculations
  // Must be called before any conditional returns (Rules of Hooks)
  const messageRenderData = useMemo(() => {
    if (!chatMessages.length) return [];

    return chatMessages.map((message, index) => {
      const prevMessage = index > 0 ? chatMessages[index - 1] : null;
      const showAvatar = shouldShowAvatar(message, prevMessage, user?._id);
      const isGrouped = shouldGroupWithPrevious(
        message,
        prevMessage,
        user?._id
      );
      const needsDateSeparator =
        !prevMessage ||
        new Date(message.createdAt).toDateString() !==
          new Date(prevMessage.createdAt).toDateString();

      return {
        message,
        showAvatar,
        isGrouped,
        needsDateSeparator,
      };
    });
  }, [chatMessages, user?._id]);

  // Mark messages as read when viewing chat
  useEffect(() => {
    const chatId = currentChat?._id;
    const chatMessages = messages[chatId];
    if (!chatId || !chatMessages?.length) return;

    const userId = user?._id;
    chatMessages
      .filter(
        (msg) =>
          msg._id &&
          msg.sender?._id !== userId &&
          msg.sender !== userId &&
          !msg.readBy?.some((r) => (r.user?._id || r.user) === userId)
      )
      .forEach((msg) => markAsRead(msg._id));
  }, [currentChat?._id, messages, user?._id, markAsRead]);

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full bg-base-200">
        <EmptyState
          icon={<MessageCircle className="h-16 w-16 text-base-content/40" />}
          title="Welcome to Chattrix"
          description="Select a conversation from the sidebar or start a new chat"
          onAction={onNewChat}
          actionLabel="Start New Chat"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChatHeader chat={currentChat} />
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 md:p-4 bg-base-200 min-h-0"
      >
        {hasMore && (
          <div className="flex justify-center py-2">
            {isLoadingMore ? (
              <LoadingIndicator
                text="Loading older messages..."
                size="sm"
                className="text-base-content/60"
              />
            ) : (
              <span className="text-xs text-base-content/40">
                Scroll up to load more
              </span>
            )}
          </div>
        )}
        {(isLoading && chatMessages.length === 0) ||
        (currentChat?._id && !paginationData) ? (
          <MessageSkeleton count={5} />
        ) : chatMessages.length === 0 ? (
          <EmptyState
            icon={<Mail className="h-12 w-12 text-base-content/40" />}
            title="No messages yet"
            description="Start the conversation!"
          />
        ) : (
          messageRenderData.map(
            ({ message, showAvatar, isGrouped, needsDateSeparator }) => (
              <div key={message._id}>
                {needsDateSeparator && (
                  <div className="flex items-center justify-center my-4">
                    <div className="px-3 py-1 bg-base-300/50 rounded-full">
                      <span className="text-xs text-base-content/60 font-medium">
                        {formatMessageDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
                <MessageBubble
                  message={message}
                  showAvatar={showAvatar}
                  isGrouped={isGrouped}
                />
              </div>
            )
          )
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
