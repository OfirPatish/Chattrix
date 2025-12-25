import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "@/lib/api";
import { extractErrorMessage } from "@/utils/errorUtils";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
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
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, data };
          }
        } catch (error) {
          const errorMessage = extractErrorMessage(error, "Login failed");
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
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, data };
          }
        } catch (error) {
          const errorMessage = extractErrorMessage(
            error,
            "Registration failed"
          );
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        const { refreshToken } = get();

        // Call logout API endpoint if refreshToken exists
        if (refreshToken) {
          try {
            await authAPI.logout(refreshToken);
          } catch (error) {
            // Continue with logout even if API call fails
            console.error("Logout API call failed:", error);
          }
        }

        // Import chatStore dynamically to avoid circular dependency
        import("@/store/chatStore").then(({ default: useChatStore }) => {
          useChatStore.getState().clearAll();
        });
        // Import socket disconnect dynamically
        import("@/hooks/useSocket").then(({ disconnectSocket }) => {
          disconnectSocket();
        });
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },

      // Backward compatibility - setToken maps to accessToken
      setToken: (token) => {
        set({ accessToken: token });
      },

      setIsAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated });
      },

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Verify and refresh auth state
      verifyAuth: async () => {
        const { accessToken } = get();
        if (!accessToken) {
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
            accessToken: null,
            refreshToken: null,
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
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
