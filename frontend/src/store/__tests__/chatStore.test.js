import { renderHook, act } from "@testing-library/react";
import useChatStore from "../chatStore";
import { chatAPI, messageAPI } from "@/lib/api";

// Mock API
jest.mock("@/lib/api");

describe("chatStore", () => {
  beforeEach(() => {
    // Clear store before each test
    act(() => {
      useChatStore.getState().clearAll();
    });
  });

  describe("fetchChats", () => {
    it("should fetch chats successfully", async () => {
      chatAPI.getChats.mockResolvedValue({
        success: true,
        data: [
          {
            _id: "chat1",
            participants: [],
            lastMessage: null,
          },
        ],
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.fetchChats();
      });

      expect(result.current.chats).toHaveLength(1);
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle fetch error", async () => {
      chatAPI.getChats.mockRejectedValue(new Error("Failed to fetch"));

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.fetchChats();
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("setCurrentChat", () => {
    it("should set current chat", () => {
      const mockChat = {
        _id: "chat1",
        participants: [],
      };

      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setCurrentChat(mockChat);
      });

      expect(result.current.currentChat).toEqual(mockChat);
    });
  });

  describe("addMessage", () => {
    it("should add message to chat", () => {
      const mockMessage = {
        _id: "msg1",
        content: "Hello",
        chat: "chat1",
        sender: { _id: "user1" },
        createdAt: new Date().toISOString(),
      };

      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage("chat1", mockMessage);
      });

      expect(result.current.messages["chat1"]).toContainEqual(mockMessage);
    });

    it("should prevent duplicate messages", () => {
      const mockMessage = {
        _id: "msg1",
        content: "Hello",
        chat: "chat1",
        sender: { _id: "user1" },
        createdAt: new Date().toISOString(),
      };

      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage("chat1", mockMessage);
        result.current.addMessage("chat1", mockMessage); // Duplicate
      });

      // Should only have one message
      expect(result.current.messages["chat1"]).toHaveLength(1);
    });
  });

  describe("updateMessage", () => {
    it("should update message in chat", () => {
      const mockMessage = {
        _id: "msg1",
        content: "Hello",
        chat: "chat1",
        readBy: [],
      };

      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage("chat1", mockMessage);
        result.current.updateMessage("chat1", "msg1", {
          readBy: [{ user: "user2", readAt: new Date() }],
        });
      });

      const updatedMessage = result.current.messages["chat1"].find(
        (m) => m._id === "msg1"
      );
      expect(updatedMessage.readBy).toHaveLength(1);
    });
  });

  describe("createChat", () => {
    it("should create chat successfully", async () => {
      chatAPI.createChat.mockResolvedValue({
        success: true,
        data: {
          _id: "new-chat",
          participants: [],
        },
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.createChat("user-id");
      });

      expect(chatAPI.createChat).toHaveBeenCalledWith("user-id");
    });
  });

  describe("fetchMessages", () => {
    it("should fetch messages successfully", async () => {
      messageAPI.getMessages.mockResolvedValue({
        success: true,
        data: [
          {
            _id: "msg1",
            content: "Hello",
            chat: "chat1",
          },
        ],
        page: 1,
        pages: 1,
        total: 1,
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.fetchMessages("chat1");
      });

      expect(result.current.messages["chat1"]).toHaveLength(1);
    });
  });
});

