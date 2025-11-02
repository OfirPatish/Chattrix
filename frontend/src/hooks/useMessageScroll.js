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
  isInitialLoadRef,
  justLoadedOlderMessagesRef,
  firstMessageIdRef,
  lastMessageCountRef,
}) {
  useEffect(() => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;

    // Don't scroll at all when loading older messages
    if (isLoadingMore) {
      return;
    }

    if (!chatMessages?.length) return;

    const messageCount = chatMessages.length;
    const firstMessageId = chatMessages[0]?._id;
    const lastMessage = chatMessages[messageCount - 1];
    const isOwnMessage =
      lastMessage?.sender?._id === userId || lastMessage?.sender === userId;

    const updateRefs = () => {
      lastMessageCountRef.current = messageCount;
      firstMessageIdRef.current = firstMessageId;
    };

    // Initial load - jump to bottom instantly
    if (isInitialLoadRef.current) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        isInitialLoadRef.current = false;
      });
      updateRefs();
      return;
    }

    // Just loaded older messages - don't scroll
    if (justLoadedOlderMessagesRef.current) {
      justLoadedOlderMessagesRef.current = false;
      updateRefs();
      return;
    }

    // Check if viewing older messages (prepended or near top)
    const olderMessagesLoaded = firstMessageIdRef.current && firstMessageId !== firstMessageIdRef.current;
    const isNearTop = container.scrollTop < 500;
    const isNewMessage = messageCount > lastMessageCountRef.current;
    const viewingOlderMessages = olderMessagesLoaded || (isNearTop && isNewMessage && !isOwnMessage);

    if (viewingOlderMessages) {
      updateRefs();
      return;
    }

    // Scroll to bottom for own messages or new messages when near bottom
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
    if (isOwnMessage || (isNearBottom && isNewMessage)) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }

    updateRefs();
  }, [
    chatMessages,
    isLoadingMore,
    currentChatId,
    userId,
    messagesContainerRef,
    messagesEndRef,
    isInitialLoadRef,
    justLoadedOlderMessagesRef,
    firstMessageIdRef,
    lastMessageCountRef,
  ]);
}
