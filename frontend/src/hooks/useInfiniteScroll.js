import { useEffect, useRef } from "react";

/**
 * Custom hook to handle infinite scroll for loading older messages
 * - Detects when user scrolls near the top
 * - Triggers loading more messages
 * - Preserves scroll position after loading
 */
export function useInfiniteScroll({
  messagesContainerRef,
  currentChatId,
  pagination,
  isLoadingMore,
  loadMoreMessages,
  scrollStateRef,
  messages,
}) {
  const hasScrolledRef = useRef(false);
  const messagesLoadedRef = useRef(false);

  // Reset flags when chat changes
  useEffect(() => {
    if (currentChatId) {
      hasScrolledRef.current = false;
      messagesLoadedRef.current = false;
    }
  }, [currentChatId]);

  // Track when messages are loaded
  useEffect(() => {
    if (currentChatId && messages[currentChatId]?.length > 0) {
      messagesLoadedRef.current = true;
    }
  }, [currentChatId, messages]);

  // Handle infinite scroll - load more when scrolling to top
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !currentChatId) return;

    const handleScroll = () => {
      hasScrolledRef.current = true;

      // Don't trigger during initial load or before messages are loaded
      if (scrollStateRef.current.isInitialLoad || !messagesLoadedRef.current) {
        return;
      }

      const paginationData = pagination[currentChatId];

      // Load more if user scrolled to top and more messages are available
      if (
        container.scrollTop < 100 &&
        paginationData?.hasMore &&
        !isLoadingMore
      ) {
        scrollStateRef.current.scrollHeight = container.scrollHeight;
        loadMoreMessages(currentChatId);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [
    currentChatId,
    pagination,
    isLoadingMore,
    loadMoreMessages,
    messagesContainerRef,
    scrollStateRef,
  ]);

  // Preserve scroll position when loading older messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    const chatMessages = messages[currentChatId];
    const state = scrollStateRef.current;

    if (container && !isLoadingMore && state.scrollHeight > 0) {
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - state.scrollHeight;
        container.scrollTop = scrollDiff;
        state.scrollHeight = 0;
        state.justLoadedOlder = true;

        // Update state to prevent detection as new messages
        if (chatMessages?.length > 0) {
          state.lastMessageCount = chatMessages.length;
          state.firstMessageId = chatMessages[0]?._id;
        }
      });
    }
  }, [
    isLoadingMore,
    messages,
    currentChatId,
    messagesContainerRef,
    scrollStateRef,
  ]);
}
