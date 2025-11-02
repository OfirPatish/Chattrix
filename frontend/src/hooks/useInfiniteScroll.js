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
  scrollHeightRef,
  justLoadedOlderMessagesRef,
  firstMessageIdRef,
  lastMessageCountRef,
  messages,
  isInitialLoadRef,
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
      // Track that user has scrolled (not just programmatic scroll)
      hasScrolledRef.current = true;

      // Don't trigger during initial load or before messages are loaded
      if (isInitialLoadRef?.current || !messagesLoadedRef.current) {
        return;
      }

      const paginationData = pagination[currentChatId];

      // Load more if user scrolled to top and more messages are available
      if (
        container.scrollTop < 100 &&
        paginationData?.hasMore &&
        !isLoadingMore
      ) {
        scrollHeightRef.current = container.scrollHeight;
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
    scrollHeightRef,
    isInitialLoadRef,
  ]);

  // Preserve scroll position when loading older messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    const chatMessages = messages[currentChatId];

    if (container && isLoadingMore === false && scrollHeightRef.current > 0) {
      // Use requestAnimationFrame to ensure DOM is updated before scrolling
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - scrollHeightRef.current;
        container.scrollTop = scrollDiff;
        scrollHeightRef.current = 0;
        // Mark that we just loaded older messages to prevent scrolling to bottom
        justLoadedOlderMessagesRef.current = true;

        // Update refs to prevent detection as new messages
        if (chatMessages && chatMessages.length > 0) {
          lastMessageCountRef.current = chatMessages.length;
          firstMessageIdRef.current = chatMessages[0]?._id;
        }
      });
    }
  }, [
    isLoadingMore,
    messages,
    currentChatId,
    messagesContainerRef,
    scrollHeightRef,
    justLoadedOlderMessagesRef,
    firstMessageIdRef,
    lastMessageCountRef,
  ]);
}
