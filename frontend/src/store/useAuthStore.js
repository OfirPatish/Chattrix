import { create } from "zustand";
import { axiosInstance } from "../shared/api/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isRegistering: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/verify");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      // No console log needed here
      set({ authUser: null });
      // No need to show error toast for authentication failures
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (data) => {
    set({ isRegistering: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      if (!error.silent) {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      if (!error.silent) {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      // Clear chat state
      useChatStore.getState().setSelectedUser(null);
    } catch (error) {
      if (!error.silent) {
        toast.error(error.response?.data?.message || "Logout failed");
      }
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/profile", data);
      set({ authUser: res.data });

      // Show success message for avatar updates
      if (data.profilePic) {
        toast.success("Avatar updated successfully");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      if (!error.silent) {
        toast.error(error.response?.data?.message || "Profile update failed");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
