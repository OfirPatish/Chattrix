"use client";

import { useRef, useMemo } from "react";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import { useMessageScroll } from "@/hooks/useMessageScroll";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useChatSwitching } from "@/hooks/chat/useChatSwitching";
import { useMessageReading } from "@/hooks/chat/useMessageReading";
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

export default function MessageList() {
  const {
    currentChat,
    messages,
    pagination,
    isLoadingMessages,
    isLoadingMore,
    loadMoreMessages,
  } = useChatStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Extract chat switching logic to custom hook
  const { scrollStateRef } = useChatSwitching(currentChat);

  // Extract message reading logic to custom hook
  useMessageReading(currentChat);

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
  // Only depend on the specific chat's messages, not entire messages object
  const currentChatId = currentChat?._id;
  const currentChatMessages = messages[currentChatId];
  const chatMessages = useMemo(() => {
    return currentChatMessages || [];
  }, [currentChatMessages]);

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

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full bg-base-200">
        <EmptyState
          icon={<MessageCircle className="h-16 w-16 text-base-content/40" />}
          title="Welcome to Chattrix"
          description="Select a conversation from the sidebar or start a new chat"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChatHeader chat={currentChat} />
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-base-200 min-h-0 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent"
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
        {(isLoadingMessages && chatMessages.length === 0) ||
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
                  <div className="flex items-center justify-center my-6">
                    <div className="px-4 py-1.5 bg-base-300/70 backdrop-blur-sm rounded-full border border-base-300 shadow-sm">
                      <span className="text-xs text-base-content/70 font-semibold">
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
