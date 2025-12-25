// Mock axios BEFORE importing api module
jest.mock("axios", () => {
  const mockAxiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
      post: jest.fn(),
    },
    create: jest.fn(() => mockAxiosInstance),
    post: jest.fn(),
  };
});

// Mock useAuthStore BEFORE importing api module
jest.mock("@/store/authStore", () => ({
  __esModule: true,
  default: {
    getState: jest.fn(() => ({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      logout: jest.fn(),
      setAccessToken: jest.fn(),
      setRefreshToken: jest.fn(),
    })),
  },
}));

import axios from "axios";
import { authAPI, userAPI, chatAPI, messageAPI } from "../api";

describe("API Client", () => {
  let mockAxiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Get the mock instance
    mockAxiosInstance = axios.create();
  });

  describe("authAPI", () => {
    it("should register user", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { _id: "123", username: "test", email: "test@test.com" },
        },
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.register({
        username: "test",
        email: "test@test.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
    });

    it("should login user", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: "123",
            username: "test",
            accessToken: "token",
            refreshToken: "refresh",
          },
        },
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.login({
        email: "test@test.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
    });

    it("should get current user", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { _id: "123", username: "test" },
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authAPI.getMe();
      expect(result.success).toBe(true);
    });

    it("should refresh token", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            accessToken: "new-token",
            refreshToken: "new-refresh",
          },
        },
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.refreshToken("refresh-token");
      expect(result.success).toBe(true);
    });

    it("should logout", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Logged out successfully",
        },
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.logout("refresh-token");
      expect(result.success).toBe(true);
    });
  });

  describe("userAPI", () => {
    it("should get users with search", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [{ _id: "1", username: "user1" }],
          page: 1,
          pages: 1,
          total: 1,
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await userAPI.getUsers("test", 1, 20);
      expect(result.success).toBe(true);
    });

    it("should get user by id", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { _id: "1", username: "user1" },
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await userAPI.getUserById("1");
      expect(result.success).toBe(true);
    });

    it("should update profile", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { _id: "1", username: "newusername" },
        },
      };
      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await userAPI.updateProfile({
        username: "newusername",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("chatAPI", () => {
    it("should get chats", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [{ _id: "1", participants: [] }],
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await chatAPI.getChats();
      expect(result.success).toBe(true);
    });

    it("should create chat", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { _id: "1", participants: [] },
        },
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await chatAPI.createChat("user-id");
      expect(result.success).toBe(true);
    });

    it("should get chat by id", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { _id: "1", participants: [] },
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await chatAPI.getChatById("1");
      expect(result.success).toBe(true);
    });
  });

  describe("messageAPI", () => {
    it("should get messages with pagination", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [{ _id: "1", content: "Hello" }],
          page: 1,
          pages: 1,
          total: 1,
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await messageAPI.getMessages("chat-id", 1, 50);
      expect(result.success).toBe(true);
    });

    it("should create message", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: "1",
            content: "Hello",
            chat: "chat-id",
          },
        },
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await messageAPI.createMessage({
        chatId: "chat-id",
        content: "Hello",
      });
      expect(result.success).toBe(true);
    });

    it("should mark message as read", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Message marked as read",
        },
      };
      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await messageAPI.markAsRead("message-id");
      expect(result.success).toBe(true);
    });
  });
});
