import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogin, useRegister, useGetMe } from "../useAuth";
import useAuthStore from "@/store/authStore";
import { authAPI } from "@/lib/api";

// Mock dependencies
jest.mock("@/store/authStore");
jest.mock("@/lib/api");

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAuth hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useLogin", () => {
    it("should login successfully", async () => {
      authAPI.login.mockResolvedValue({
        success: true,
        data: {
          _id: "123",
          username: "testuser",
          accessToken: "token",
          refreshToken: "refresh",
        },
      });

      const mockSetUser = jest.fn();
      const mockSetAccessToken = jest.fn();
      const mockSetRefreshToken = jest.fn();
      const mockSetIsAuthenticated = jest.fn();

      // Mock useAuthStore as a hook (returns state when called)
      useAuthStore.mockReturnValue({
        user: null,
      });
      // Mock getState as a property of the store function itself
      useAuthStore.getState = jest.fn(() => ({
        setUser: mockSetUser,
        setAccessToken: mockSetAccessToken,
        setRefreshToken: mockSetRefreshToken,
        setIsAuthenticated: mockSetIsAuthenticated,
      }));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate({
          email: "test@test.com",
          password: "password123",
        });
      });

      expect(authAPI.login).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
      expect(mockSetUser).toHaveBeenCalled();
    });

    it("should handle login error", async () => {
      authAPI.login.mockRejectedValue(new Error("Invalid credentials"));

      const mockSetError = jest.fn();

      useAuthStore.mockReturnValue({
        user: null,
      });
      useAuthStore.getState = jest.fn(() => ({
        setError: mockSetError,
      }));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate({
          email: "test@test.com",
          password: "wrongpassword",
        });
      });

      expect(authAPI.login).toHaveBeenCalled();
    });
  });

  describe("useRegister", () => {
    it("should register successfully", async () => {
      authAPI.register.mockResolvedValue({
        success: true,
        data: {
          _id: "123",
          username: "newuser",
          accessToken: "token",
          refreshToken: "refresh",
        },
      });

      const mockSetUser = jest.fn();
      const mockSetAccessToken = jest.fn();
      const mockSetRefreshToken = jest.fn();
      const mockSetIsAuthenticated = jest.fn();

      useAuthStore.mockReturnValue({
        user: null,
      });
      useAuthStore.getState = jest.fn(() => ({
        setUser: mockSetUser,
        setAccessToken: mockSetAccessToken,
        setRefreshToken: mockSetRefreshToken,
        setIsAuthenticated: mockSetIsAuthenticated,
      }));

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate({
          username: "newuser",
          email: "new@test.com",
          password: "password123",
        });
      });

      expect(authAPI.register).toHaveBeenCalledWith({
        username: "newuser",
        email: "new@test.com",
        password: "password123",
      });
      expect(mockSetUser).toHaveBeenCalled();
    });
  });

  describe("useGetMe", () => {
    it("should fetch current user", async () => {
      authAPI.getMe.mockResolvedValue({
        success: true,
        data: { _id: "123", username: "testuser" },
      });

      const { result } = renderHook(() => useGetMe(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.username).toBe("testuser");
    });

    it("should handle fetch error", async () => {
      authAPI.getMe.mockRejectedValue(new Error("Unauthorized"));

      const { result } = renderHook(() => useGetMe(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
});

