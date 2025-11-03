import { useEffect, useRef } from "react";

/**
 * Custom hook to handle message scroll behavior
 * - Scrolls to bottom on initial load
 * - Scrolls to bottom when user sends messages
 * - Prevents scrolling when loading older messages
 */
export function useMessageScroll({
  messagesContainerRef,
  messagesEndRef,
  chatMessages,
  isLoadingMore,
  currentChatId,
  userId,
  scrollStateRef,
}) {
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingMore || !chatMessages?.length) return;

    const state = scrollStateRef.current;
    const messageCount = chatMessages.length;
    const firstMessageId = chatMessages[0]?._id;
    const lastMessage = chatMessages[messageCount - 1];
    const isOwnMessage =
      lastMessage?.sender?._id === userId || lastMessage?.sender === userId;

    // Initial load - jump to bottom instantly
    if (state.isInitialLoad) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        state.isInitialLoad = false;
      });
      state.lastMessageCount = messageCount;
      state.firstMessageId = firstMessageId;
      return;
    }

    // Just loaded older messages - don't scroll
    if (state.justLoadedOlder) {
      state.justLoadedOlder = false;
      state.lastMessageCount = messageCount;
      state.firstMessageId = firstMessageId;
      return;
    }

    // Check if viewing older messages
    const olderMessagesLoaded =
      state.firstMessageId && firstMessageId !== state.firstMessageId;
    const isNearTop = container.scrollTop < 500;
    const isNewMessage = messageCount > state.lastMessageCount;
    const viewingOlderMessages =
      olderMessagesLoaded || (isNearTop && isNewMessage && !isOwnMessage);

    if (viewingOlderMessages) {
      state.lastMessageCount = messageCount;
      state.firstMessageId = firstMessageId;
      return;
    }

    // Scroll to bottom for own messages or new messages when near bottom
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      200;
    if (isOwnMessage || (isNearBottom && isNewMessage)) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }

    state.lastMessageCount = messageCount;
    state.firstMessageId = firstMessageId;
  }, [
    chatMessages,
    isLoadingMore,
    currentChatId,
    userId,
    messagesContainerRef,
    messagesEndRef,
    scrollStateRef,
  ]);
}
