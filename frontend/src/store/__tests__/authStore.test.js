import { renderHook, act } from "@testing-library/react";
import useAuthStore from "../authStore";

// Mock the API
jest.mock("@/lib/api", () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    getMe: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock socket disconnect
jest.mock("@/hooks/useSocket", () => ({
  disconnectSocket: jest.fn(),
}));

// Mock chatStore
jest.mock("@/store/chatStore", () => ({
  __esModule: true,
  default: {
    getState: jest.fn(() => ({
      clearAll: jest.fn(),
    })),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    // Clear store before each test
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const { authAPI } = require("@/lib/api");
      authAPI.login.mockResolvedValue({
        success: true,
        data: {
          _id: "123",
          username: "testuser",
          email: "test@test.com",
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        const response = await result.current.login(
          "test@test.com",
          "password123"
        );
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.username).toBe("testuser");
      expect(result.current.accessToken).toBe("access-token");
    });

    it("should handle login failure", async () => {
      const { authAPI } = require("@/lib/api");
      authAPI.login.mockRejectedValue(new Error("Login failed"));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        const response = await result.current.login(
          "test@test.com",
          "wrongpassword"
        );
        expect(response.success).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe("register", () => {
    it("should register successfully", async () => {
      const { authAPI } = require("@/lib/api");
      authAPI.register.mockResolvedValue({
        success: true,
        data: {
          _id: "123",
          username: "newuser",
          email: "new@test.com",
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        const response = await result.current.register(
          "newuser",
          "new@test.com",
          "password123"
        );
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.username).toBe("newuser");
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      const { authAPI } = require("@/lib/api");
      authAPI.logout.mockResolvedValue({
        success: true,
        message: "Logged out",
      });

      // Set initial state
      act(() => {
        useAuthStore.setState({
          user: { _id: "123", username: "test" },
          accessToken: "token",
          refreshToken: "refresh",
          isAuthenticated: true,
        });
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.accessToken).toBeNull();
    });
  });

  describe("verifyAuth", () => {
    it("should verify auth successfully", async () => {
      const { authAPI } = require("@/lib/api");
      authAPI.getMe.mockResolvedValue({
        success: true,
        data: { _id: "123", username: "testuser" },
      });

      act(() => {
        useAuthStore.setState({ accessToken: "valid-token" });
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        const isValid = await result.current.verifyAuth();
        expect(isValid).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.username).toBe("testuser");
    });

    it("should return false for invalid token", async () => {
      const { authAPI } = require("@/lib/api");
      authAPI.getMe.mockRejectedValue(new Error("Unauthorized"));

      act(() => {
        useAuthStore.setState({ accessToken: "invalid-token" });
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        const isValid = await result.current.verifyAuth();
        expect(isValid).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("token management", () => {
    it("should set access token", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setAccessToken("new-access-token");
      });

      expect(result.current.accessToken).toBe("new-access-token");
    });

    it("should set refresh token", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setRefreshToken("new-refresh-token");
      });

      expect(result.current.refreshToken).toBe("new-refresh-token");
    });
  });
});

