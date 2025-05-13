import { useState, useEffect, useRef } from "react";

// --- useMessageLoader hook
export const useMessageLoader = ({
  getMessages,
  isMessagesLoading,
  selectedUser,
  authUser,
  messages,
  MESSAGES_PER_PAGE,
  isCurrentUserMessage,
  hasMore,
}) => {
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const prevMessagesLengthRef = useRef(0);
  const messageEndRef = useRef(null);
  const chatDivRef = useRef(null);
  const prevScrollHeightRef = useRef(0);

  // Load initial messages when user changes
  useEffect(() => {
    if (selectedUser?._id) {
      setPage(1);
      getMessages(selectedUser._id, 1, MESSAGES_PER_PAGE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?._id]);

  // Scroll to latest message when a new message is sent by the current user
  useEffect(() => {
    if (!messages?.length) return;
    const currentLength = messages.length;
    const previousLength = prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = currentLength;
    if (previousLength === 0) return;
    if (currentLength > previousLength) {
      const lastMessage = messages[messages.length - 1];
      const shouldScrollToBottom = isCurrentUserMessage(authUser, lastMessage.senderId);
      if (shouldScrollToBottom && messageEndRef.current) {
        setTimeout(() => {
          messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 50);
      }
    }
  }, [messages, authUser, isCurrentUserMessage]);

  // Scroll to bottom when a new chat is loaded (page === 1)
  useEffect(() => {
    // Only scroll to bottom on initial chat load (page === 1)
    if (page === 1 && messages.length > 0 && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
    // Only run when chat changes, page changes, or messages are loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?._id, page, messages.length]);

  // Function to load more (older) messages
  const fetchMoreMessages = async () => {
    if (!selectedUser?._id) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await getMessages(selectedUser._id, nextPage, MESSAGES_PER_PAGE);
    setPage(nextPage);
    setLoadingMore(false);
  };

  // Custom scroll handler for loading older messages
  const handleScroll = async (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMore && !loadingMore) {
      // Save current scroll height before loading more
      prevScrollHeightRef.current = e.target.scrollHeight;
      await fetchMoreMessages();
      // After loading, maintain scroll position so user doesn't jump
      setTimeout(() => {
        if (chatDivRef.current) {
          chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight - prevScrollHeightRef.current;
        }
      }, 50);
    }
  };

  // Expose a scrollToLatest function for manual scroll-to-bottom
  const scrollToLatest = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // Expose a boolean for 'No more messages' display
  const showNoMoreMessages =
    messages.length > 0 &&
    !loadingMore &&
    typeof selectedUser?._id !== "undefined" &&
    typeof hasMore !== "undefined" &&
    hasMore === false;

  return {
    page,
    loadingMore,
    fetchMoreMessages,
    messageEndRef,
    chatDivRef,
    handleScroll,
    scrollToLatest,
    showNoMoreMessages,
  };
};
