import { useMutation, useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";

// Helper to extract error message from API errors
function extractErrorMessage(error) {
  if (error.response?.data) {
    // Handle validation errors (array format)
    if (
      error.response.data.errors &&
      Array.isArray(error.response.data.errors)
    ) {
      return error.response.data.errors
        .map((err) => err.msg || err.message)
        .join(", ");
    }
    // Handle regular error messages
    return (
      error.response.data.message ||
      error.response.data.error ||
      "An error occurred"
    );
  }
  return error.message || "An error occurred";
}

// Login mutation
export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await authAPI.login({ email, password });
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || "Login failed");
    },
    onSuccess: (data) => {
      // Update Zustand store (which will persist to localStorage via persist middleware)
      useAuthStore.getState().setUser(data);
      useAuthStore.getState().setToken(data.token);
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
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || "Registration failed");
    },
    onSuccess: (data) => {
      // Update Zustand store (which will persist to localStorage via persist middleware)
      useAuthStore.getState().setUser(data);
      useAuthStore.getState().setToken(data.token);
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
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No token available");
      }
      const response = await authAPI.getMe();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || "Failed to get user");
    },
    enabled: !!token,
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
