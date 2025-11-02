import { create } from "zustand";
import { chatAPI, messageAPI } from "@/lib/api";

const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: {},
  pagination: {}, // { chatId: { page: 1, hasMore: true, totalPages: 1 } }
  isLoading: false,
  isLoadingMore: false,
  error: null,

  // Chat actions
  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching chats...");
      const response = await chatAPI.getChats();
      console.log("Chats response:", response);

      if (response && response.success) {
        set({ chats: response.data || [], isLoading: false, error: null });
      } else {
        // If response doesn't have success, still set loading to false
        console.warn("Unexpected response format:", response);
        set({
          chats: [],
          isLoading: false,
          error:
            response?.error || response?.message || "Failed to fetch chats",
        });
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      set({
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch chats",
        isLoading: false,
        chats: [], // Ensure chats is set even on error
      });
    }
  },

  createChat: async (userId) => {
    try {
      const response = await chatAPI.createChat(userId);
      if (response.success) {
        const newChat = response.data;
        set((state) => ({
          chats: [newChat, ...state.chats.filter((c) => c._id !== newChat._id)],
          currentChat: newChat,
        }));
        return { success: true, chat: newChat };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to create chat",
      };
    }
  },

  setCurrentChat: (chat) => {
    set({ currentChat: chat });
  },

  fetchChatById: async (chatId) => {
    try {
      const response = await chatAPI.getChatById(chatId);
      if (response.success) {
        const chat = response.data;
        set((state) => ({
          chats: state.chats.map((c) => (c._id === chatId ? chat : c)),
          currentChat:
            state.currentChat?._id === chatId ? chat : state.currentChat,
        }));
        return { success: true, chat };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch chat",
      };
    }
  },

  addChat: (chat) => {
    set((state) => ({
      chats: [chat, ...state.chats.filter((c) => c._id !== chat._id)],
    }));
  },

  updateChat: (chatId, updates) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat._id === chatId ? { ...chat, ...updates } : chat
      ),
      currentChat:
        state.currentChat?._id === chatId
          ? { ...state.currentChat, ...updates }
          : state.currentChat,
    }));
  },

  // Message actions
  fetchMessages: async (chatId, reset = false) => {
    const state = get();

    // Check if already loaded and not resetting
    if (state.messages[chatId] && !reset) {
      return;
    }

    // Check if already loading
    if (state.isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

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
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch messages",
        isLoading: false,
      });
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
        error: error.response?.data?.error || "Failed to load more messages",
        isLoadingMore: false,
      });
    }
  },

  addMessage: (chatId, message) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
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

  clearAll: () => {
    set({
      chats: [],
      currentChat: null,
      messages: {},
      pagination: {},
      error: null,
      isLoading: false,
      isLoadingMore: false,
    });
  },
}));

export default useChatStore;
