import { useMutation, useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { extractErrorMessage } from "@/utils/errorUtils";

// Login mutation
export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await authAPI.login({ email, password });
      if (response && response.success) {
        return response.data;
      }
      throw new Error(response?.error || response?.message || "Login failed");
    },
    onSuccess: (data) => {
      // Update Zustand store (which will persist to localStorage via persist middleware)
      useAuthStore.getState().setUser(data);
      useAuthStore.getState().setAccessToken(data.accessToken);
      useAuthStore.getState().setRefreshToken(data.refreshToken);
      useAuthStore.getState().setIsAuthenticated(true);
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      useAuthStore.getState().setError(errorMessage);
    },
  });
}

// Register mutation
export function useRegister() {
  return useMutation({
    mutationFn: async ({ username, email, password }) => {
      const response = await authAPI.register({ username, email, password });
      if (response && response.success) {
        return response.data;
      }
      throw new Error(
        response?.error || response?.message || "Registration failed"
      );
    },
    onSuccess: (data) => {
      // Update Zustand store (which will persist to localStorage via persist middleware)
      useAuthStore.getState().setUser(data);
      useAuthStore.getState().setAccessToken(data.accessToken);
      useAuthStore.getState().setRefreshToken(data.refreshToken);
      useAuthStore.getState().setIsAuthenticated(true);
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      useAuthStore.getState().setError(errorMessage);
    },
  });
}

// Get current user query
export function useGetMe() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No token available");
      }
      const response = await authAPI.getMe();
      if (response && response.success) {
        return response.data;
      }
      throw new Error(
        response?.error || response?.message || "Failed to get user"
      );
    },
    enabled: !!accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (user) => {
      // Update Zustand store
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setIsAuthenticated(true);
    },
    onError: () => {
      // Clear auth on error
      useAuthStore.getState().logout();
    },
  });
}
