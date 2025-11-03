// Initial state and state structure for chat store
export const initialChatState = {
  chats: [],
  currentChat: null,
  messages: {},
  pagination: {}, // { chatId: { page: 1, hasMore: true, totalPages: 1 } }
  isLoading: false, // Loading chats list
  isLoadingMessages: false, // Loading messages (separate from chats loading)
  isLoadingMore: false,
  error: null,
  hasInitiallyFetched: false, // Track if initial fetch has been attempted
};

// Helper to extract error message
export const getErrorMessage = (error, defaultMsg) => {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    defaultMsg
  );
};
