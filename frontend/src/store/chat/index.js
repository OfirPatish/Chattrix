import { create } from "zustand";
import { initialChatState } from "./chatState";
import { createChatActions } from "./chatActions";
import { createMessageActions } from "./messageActions";

// Combined chat store - combines state, chat actions, and message actions
const useChatStore = create((set, get) => ({
  // Initial state
  ...initialChatState,

  // Chat actions
  ...createChatActions(set, get),

  // Message actions
  ...createMessageActions(set, get),

  // Utility actions
  clearAll: () => {
    set({
      chats: [],
      currentChat: null,
      messages: {},
      pagination: {},
      error: null,
      isLoading: false,
      isLoadingMessages: false,
      isLoadingMore: false,
      hasInitiallyFetched: false,
    });
  },
}));

export default useChatStore;
