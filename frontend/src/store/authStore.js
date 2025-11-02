import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "@/lib/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          if (response.success) {
            const { data } = response;
            set({
              user: data,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, data };
          }
        } catch (error) {
          let errorMessage = "Login failed";
          if (error.response?.data) {
            // Handle validation errors (array format)
            if (
              error.response.data.errors &&
              Array.isArray(error.response.data.errors)
            ) {
              errorMessage = error.response.data.errors
                .map((err) => err.msg || err.message)
                .join(", ");
            } else {
              // Handle regular error messages
              errorMessage =
                error.response.data.message ||
                error.response.data.error ||
                "Login failed";
            }
          }
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register({
            username,
            email,
            password,
          });
          if (response.success) {
            const { data } = response;
            set({
              user: data,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, data };
          }
        } catch (error) {
          let errorMessage = "Registration failed";
          if (error.response?.data) {
            // Handle validation errors (array format)
            if (
              error.response.data.errors &&
              Array.isArray(error.response.data.errors)
            ) {
              errorMessage = error.response.data.errors
                .map((err) => err.msg || err.message)
                .join(", ");
            } else {
              // Handle regular error messages
              errorMessage =
                error.response.data.message ||
                error.response.data.error ||
                "Registration failed";
            }
          }
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        set({ token });
      },

      setIsAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated });
      },

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Verify and refresh auth state
      verifyAuth: async () => {
        const { token } = get();
        if (!token) {
          return false;
        }

        try {
          const response = await authAPI.getMe();
          if (response.success) {
            const user = response.data;
            set({ user, isAuthenticated: true });
            return true;
          }
        } catch (error) {
          // Token invalid, clear auth
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
