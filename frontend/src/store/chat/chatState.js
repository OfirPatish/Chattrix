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

import { extractErrorMessage } from "@/utils/errorUtils";

// Helper to extract error message (backward compatibility)
export const getErrorMessage = (error, defaultMsg = "An error occurred") => {
  return extractErrorMessage(error, defaultMsg);
};
