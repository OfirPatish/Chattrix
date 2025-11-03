import { messageAPI } from "@/lib/api";
import { getErrorMessage } from "./chatState";

// Message-related actions for the store
export const createMessageActions = (set, get) => ({
  fetchMessages: async (chatId, reset = false) => {
    const state = get();

    // Check if already loaded and not resetting
    if (state.messages[chatId] && !reset) {
      return;
    }

    // Check if already loading messages
    if (state.isLoadingMessages) {
      return;
    }

    set({ isLoadingMessages: true, error: null });

    // Only clear messages after starting to load (to prevent flicker)
    if (reset) {
      const newMessages = { ...state.messages };
      const newPagination = { ...state.pagination };
      delete newMessages[chatId];
      delete newPagination[chatId];
      set({ messages: newMessages, pagination: newPagination });
    }

    try {
      const response = await messageAPI.getMessages(chatId, 1, 50);
      if (response.success) {
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: response.data,
          },
          pagination: {
            ...state.pagination,
            [chatId]: {
              page: response.page || 1,
              hasMore: response.page < response.pages,
              totalPages: response.pages || 1,
            },
          },
          isLoadingMessages: false,
        }));
      } else {
        // Mark as fetched even on error so we don't show loading indefinitely
        set((state) => ({
          isLoadingMessages: false,
          pagination: {
            ...state.pagination,
            [chatId]: { page: 1, hasMore: false, totalPages: 1 },
          },
        }));
      }
    } catch (error) {
      set((state) => ({
        error: getErrorMessage(error, "Failed to fetch messages"),
        isLoadingMessages: false,
        pagination: {
          ...state.pagination,
          [chatId]: { page: 1, hasMore: false, totalPages: 1 },
        },
      }));
    }
  },

  loadMoreMessages: async (chatId) => {
    const pagination = get().pagination[chatId];

    // Check if we can load more
    if (!pagination?.hasMore || get().isLoadingMore) {
      return;
    }

    set({ isLoadingMore: true });
    const startTime = performance.now();
    const minLoadingTime = 800; // Minimum 800ms loading time

    try {
      const nextPage = pagination.page + 1;
      const response = await messageAPI.getMessages(chatId, nextPage, 50);

      // Calculate remaining time to meet minimum loading duration
      const elapsedTime = performance.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      if (response.success && response.data.length > 0) {
        set((state) => {
          const existingMessages = state.messages[chatId] || [];
          // Prepend older messages to the beginning
          return {
            messages: {
              ...state.messages,
              [chatId]: [...response.data, ...existingMessages],
            },
            pagination: {
              ...state.pagination,
              [chatId]: {
                page: response.page || nextPage,
                hasMore: response.page < response.pages,
                totalPages: response.pages || 1,
              },
            },
            isLoadingMore: false,
          };
        });
      } else {
        set({ isLoadingMore: false });
      }
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to load more messages"),
        isLoadingMore: false,
      });
    }
  },

  addMessage: (chatId, message) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];

      // Prevent duplicate messages (check by message ID)
      const messageExists = chatMessages.some((m) => m._id === message._id);
      if (messageExists) {
        console.warn("Duplicate message prevented:", message._id);
        return state; // Return unchanged state
      }

      return {
        messages: {
          ...state.messages,
          [chatId]: [...chatMessages, message],
        },
      };
    });
  },

  updateMessage: (chatId, messageId, updates) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: chatMessages.map((msg) =>
            msg._id === messageId ? { ...msg, ...updates } : msg
          ),
        },
      };
    });
  },

  clearMessages: () => {
    set({ messages: {}, pagination: {}, currentChat: null });
  },
});
