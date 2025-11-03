import { chatAPI } from "@/lib/api";
import { getErrorMessage } from "./chatState";

// Chat-related actions for the store
export const createChatActions = (set, get) => ({
  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatAPI.getChats();
      if (response?.success) {
        set((state) => {
          const fetchedChats = response.data || [];
          const currentChatId = state.currentChat?._id;

          // If we have a currentChat that was created before fetch completed,
          // make sure it's included in the chats array
          let chats = fetchedChats;
          if (
            currentChatId &&
            !fetchedChats.find((c) => c._id === currentChatId)
          ) {
            chats = [state.currentChat, ...fetchedChats];
          }

          return {
            chats,
            isLoading: false,
            error: null,
            hasInitiallyFetched: true,
          };
        });
      } else {
        set({
          chats: [],
          isLoading: false,
          error:
            response?.error || response?.message || "Failed to fetch chats",
          hasInitiallyFetched: true,
        });
      }
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to fetch chats"),
        isLoading: false,
        chats: [],
        hasInitiallyFetched: true,
      });
    }
  },

  createChat: async (userId) => {
    try {
      const response = await chatAPI.createChat(userId);
      if (response?.success) {
        const newChat = response.data;
        set((state) => {
          // Check if chat already exists to avoid duplicate
          const existingChat = state.chats.find((c) => c._id === newChat._id);

          // If chat already exists, just update currentChat, don't modify chats array
          if (existingChat) {
            return { currentChat: newChat };
          }

          // Chat doesn't exist, add it to the list
          // Only update chats array if hasInitiallyFetched is true (initial load completed)
          // This prevents skeleton from showing when creating first chat
          if (state.hasInitiallyFetched) {
            return {
              chats: [
                newChat,
                ...state.chats.filter((c) => c._id !== newChat._id),
              ],
              currentChat: newChat,
            };
          } else {
            // Initial fetch hasn't completed yet, just set currentChat
            // The chat will be added when fetchChats completes
            return { currentChat: newChat };
          }
        });
        return { success: true, chat: newChat };
      }
      return {
        success: false,
        error: response?.error || response?.message || "Failed to create chat",
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Failed to create chat"),
      };
    }
  },

  setCurrentChat: (chat) => {
    set((state) => {
      // Only update if chat ID changed to prevent unnecessary re-renders
      if (state.currentChat?._id === chat?._id) {
        return state; // No change needed
      }
      return { currentChat: chat };
    });
  },

  fetchChatById: async (chatId) => {
    try {
      const response = await chatAPI.getChatById(chatId);
      if (response?.success) {
        const chat = response.data;
        set((state) => {
          const existingChat = state.chats.find((c) => c._id === chatId);

          if (existingChat) {
            // Chat already exists in list - don't update chats array to prevent ChatList re-render
            // Only update currentChat if it's the active chat and data changed
            if (state.currentChat?._id === chatId) {
              // Check if currentChat needs updating (participants might have changed)
              const participantsChanged =
                JSON.stringify(state.currentChat.participants) !==
                JSON.stringify(chat.participants);

              if (participantsChanged) {
                return { currentChat: chat };
              }
            }
            // No changes needed - return state unchanged
            return state;
          }

          // Chat doesn't exist in list - add it
          return {
            chats: [chat, ...state.chats.filter((c) => c._id !== chatId)],
            currentChat:
              state.currentChat?._id === chatId ? chat : state.currentChat,
          };
        });
        return { success: true, chat };
      }
      return {
        success: false,
        error: response?.error || response?.message || "Failed to fetch chat",
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Failed to fetch chat"),
      };
    }
  },

  addChat: (chat) => {
    set((state) => ({
      chats: [chat, ...state.chats.filter((c) => c._id !== chat._id)],
    }));
  },

  updateChat: (chatId, updates) => {
    set((state) => {
      const existingChat = state.chats.find((c) => c._id === chatId);
      const isCurrentChat = state.currentChat?._id === chatId;

      // Check if updates would actually change anything
      let hasChanges = false;
      if (existingChat) {
        hasChanges = Object.keys(updates).some((key) => {
          const existingValue = existingChat[key];
          const newValue = updates[key];
          // Deep comparison for objects/arrays
          return JSON.stringify(existingValue) !== JSON.stringify(newValue);
        });

        if (!hasChanges) {
          // No actual changes, return state unchanged to prevent re-render
          return state;
        }
      }

      // Only update chats array if chat exists in list AND has changes
      // This prevents ChatList re-render when clicking existing chats
      const updatedChats =
        existingChat && hasChanges
          ? state.chats.map((chat) =>
              chat._id === chatId ? { ...chat, ...updates } : chat
            )
          : state.chats; // Keep same reference if no changes

      return {
        chats: updatedChats,
        currentChat: isCurrentChat
          ? { ...state.currentChat, ...updates }
          : state.currentChat,
      };
    });
  },
});
