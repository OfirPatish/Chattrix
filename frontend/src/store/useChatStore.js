import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../shared/api/axios";
import { useAuthStore } from "./useAuthStore";

// --- Chat-related constants and utility functions ---

export const MESSAGES_PER_PAGE = 25;

/**
 * Determines if a message was sent by the current user
 * @param {Object} authUser Current authenticated user
 * @param {string} senderId ID of the message sender
 * @returns {boolean} True if message was sent by current user
 */
export const isCurrentUserMessage = (authUser, senderId) => {
  return authUser && senderId === authUser._id;
};

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  hasMore: true,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      if (!error.silent) {
        toast.error(error.response?.data?.message || "Failed to load users");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId, page = 1, limit = 25) => {
    if (page === 1) {
      set({ isMessagesLoading: true });
    }

    try {
      const res = await axiosInstance.get(`/messages/${userId}`, {
        params: { page, limit },
      });

      // Extract messages and pagination from response
      const { messages, pagination } = res.data;

      // If it's the first page, replace messages
      // For subsequent pages, add older messages before existing ones
      if (page === 1) {
        set({ messages: messages });
      } else {
        // For subsequent pages, add older messages at the beginning
        const combinedMessages = [...messages, ...get().messages];
        set({ messages: combinedMessages });
      }

      // Set hasMore state from the API response
      if (pagination && pagination.hasMore !== undefined) {
        set({ hasMore: pagination.hasMore });
      }

      return messages;
    } catch (error) {
      if (!error.silent) {
        toast.error(error.response?.data?.message || "Failed to load messages");
      }
      return [];
    } finally {
      if (page === 1) {
        set({ isMessagesLoading: false });
      }
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/${selectedUser._id}`, messageData);

      // Add new message to the end of the list (most recent)
      set({ messages: [...messages, res.data] });
    } catch (error) {
      if (!error.silent) {
        toast.error(error.response?.data?.message || "Failed to send message");
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id;

      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    if (selectedUser === null) {
      set({ selectedUser: null, messages: [], hasMore: true });
    } else {
      set({ selectedUser });
    }
  },
}));
