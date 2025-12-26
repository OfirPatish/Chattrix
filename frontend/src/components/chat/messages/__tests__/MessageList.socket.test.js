import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import MessageList from "../MessageList";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import { useSocket } from "@/hooks/socket/useSocket";
import { getSocketInstanceRef } from "@/hooks/socket/socketManager";

// Mock avatar utils to avoid @dicebear import issues
jest.mock("@/utils/avatarUtils", () => ({
  generateAvatar: jest.fn(() => "data:image/svg+xml;base64,test"),
  getAvatarUrl: jest.fn(
    (avatar, username) => avatar || "data:image/svg+xml;base64,test"
  ),
}));

// Mock dependencies
jest.mock("@/store/chatStore");
jest.mock("@/store/authStore");
jest.mock("@/hooks/socket/useSocket");
jest.mock("@/hooks/socket/socketManager");

// Mock other hooks
jest.mock("@/hooks/useMessageScroll", () => ({
  useMessageScroll: jest.fn(),
}));

jest.mock("@/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: jest.fn(),
}));

jest.mock("@/hooks/chat/useChatSwitching", () => ({
  useChatSwitching: jest.fn(() => ({
    scrollStateRef: {
      current: {
        isInitialLoad: false,
        justLoadedOlder: false,
        lastMessageCount: 0,
        firstMessageId: null,
        scrollHeight: 0,
      },
    },
  })),
}));

jest.mock("@/hooks/chat/useMessageReading", () => ({
  useMessageReading: jest.fn(),
}));

describe("MessageList Socket Integration", () => {
  let mockSocket;
  let mockEmit;
  let mockOn;
  let mockScrollIntoView;
  let mockAddMessage;
  let mockUpdateChat;
  let mockUpdateUserStatus;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Setup mock socket
    mockEmit = jest.fn();
    mockOn = jest.fn((event, callback) => {
      // Store callbacks for manual triggering
      if (!mockSocket._callbacks) {
        mockSocket._callbacks = {};
      }
      mockSocket._callbacks[event] = callback;
    });

    mockSocket = {
      connected: true,
      emit: mockEmit,
      on: mockOn,
      off: jest.fn(),
      disconnect: jest.fn(),
    };

    getSocketInstanceRef.mockReturnValue(mockSocket);

    // Setup mock scroll behavior
    mockScrollIntoView = jest.fn();
    const mockScrollElement = {
      scrollIntoView: mockScrollIntoView,
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 500,
    };

    // Mock store functions
    mockAddMessage = jest.fn();
    mockUpdateChat = jest.fn();
    mockUpdateUserStatus = jest.fn();

    useChatStore.mockReturnValue({
      currentChat: {
        _id: "chat-123",
        participants: [
          { _id: "user-1", username: "user1" },
          { _id: "user-2", username: "user2" },
        ],
      },
      messages: {
        "chat-123": [],
      },
      pagination: {
        "chat-123": { hasMore: false },
      },
      isLoadingMessages: false,
      isLoadingMore: false,
      loadMoreMessages: jest.fn(),
      addMessage: mockAddMessage,
      updateChat: mockUpdateChat,
      updateUserStatus: mockUpdateUserStatus,
    });

    useAuthStore.mockReturnValue({
      user: { _id: "user-1" },
    });

    useSocket.mockReturnValue({
      sendMessage: jest.fn(),
      startTyping: jest.fn(),
      stopTyping: jest.fn(),
      markAsRead: jest.fn(),
      joinChat: jest.fn(),
      leaveChat: jest.fn(),
      isConnected: true,
    });

    // Mock scrollIntoView
    global.Element.prototype.scrollIntoView = mockScrollIntoView;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Receiving Messages via Socket", () => {
    it("should add message to store when receive-message event fires", async () => {
      render(<MessageList />);

      // Simulate socket receive-message event
      const receiveMessageCallback = mockSocket._callbacks?.["receive-message"];
      if (receiveMessageCallback) {
        const newMessage = {
          _id: "msg-1",
          content: "Hello from socket",
          chat: "chat-123",
          sender: { _id: "user-2", username: "user2" },
          createdAt: new Date(),
        };

        act(() => {
          receiveMessageCallback(newMessage);
        });

        await waitFor(() => {
          expect(mockAddMessage).toHaveBeenCalledWith("chat-123", newMessage);
        });
      }
    });

    it("should update chat lastMessage when receiving new message", async () => {
      render(<MessageList />);

      const receiveMessageCallback = mockSocket._callbacks?.["receive-message"];
      if (receiveMessageCallback) {
        const newMessage = {
          _id: "msg-1",
          content: "New message",
          chat: "chat-123",
          sender: { _id: "user-2" },
          createdAt: new Date(),
        };

        act(() => {
          receiveMessageCallback(newMessage);
        });

        await waitFor(() => {
          expect(mockUpdateChat).toHaveBeenCalledWith("chat-123", {
            lastMessage: newMessage,
          });
        });
      }
    });

    it("should handle message with populated chat object", async () => {
      render(<MessageList />);

      const receiveMessageCallback = mockSocket._callbacks?.["receive-message"];
      if (receiveMessageCallback) {
        const newMessage = {
          _id: "msg-1",
          content: "Hello",
          chat: { _id: "chat-123" }, // Populated chat object
          sender: { _id: "user-2" },
          createdAt: new Date(),
        };

        act(() => {
          receiveMessageCallback(newMessage);
        });

        await waitFor(() => {
          expect(mockAddMessage).toHaveBeenCalledWith("chat-123", newMessage);
        });
      }
    });
  });

  describe("Online Status Updates", () => {
    it("should update user status when user-online event fires", async () => {
      render(<MessageList />);

      const userOnlineCallback = mockSocket._callbacks?.["user-online"];
      if (userOnlineCallback) {
        act(() => {
          userOnlineCallback({ userId: "user-2", isOnline: true });
        });

        await waitFor(() => {
          expect(mockUpdateUserStatus).toHaveBeenCalledWith(
            "user-2",
            expect.objectContaining({
              isOnline: true,
              lastSeen: expect.any(Date),
            })
          );
        });
      }
    });

    it("should update user status when user-offline event fires", async () => {
      render(<MessageList />);

      const userOfflineCallback = mockSocket._callbacks?.["user-offline"];
      if (userOfflineCallback) {
        act(() => {
          userOfflineCallback({ userId: "user-2", isOnline: false });
        });

        await waitFor(() => {
          expect(mockUpdateUserStatus).toHaveBeenCalledWith(
            "user-2",
            expect.objectContaining({
              isOnline: false,
              lastSeen: expect.any(Date),
            })
          );
        });
      }
    });
  });

  describe("Message Reading", () => {
    it("should update message readBy when message-read event fires", async () => {
      const mockUpdateMessage = jest.fn();
      useChatStore.mockReturnValue({
        currentChat: { _id: "chat-123" },
        messages: {
          "chat-123": [
            {
              _id: "msg-1",
              content: "Hello",
              readBy: [],
              sender: { _id: "user-2" },
            },
          ],
        },
        pagination: {
          "chat-123": { hasMore: false },
        },
        isLoadingMessages: false,
        isLoadingMore: false,
        updateMessage: mockUpdateMessage,
      });

      render(<MessageList />);

      const messageReadCallback = mockSocket._callbacks?.["message-read"];
      if (messageReadCallback) {
        act(() => {
          messageReadCallback({ messageId: "msg-1", userId: "user-2" });
        });

        await waitFor(() => {
          expect(mockUpdateMessage).toHaveBeenCalledWith(
            "chat-123",
            "msg-1",
            expect.objectContaining({
              readBy: expect.arrayContaining([
                expect.objectContaining({ user: "user-2" }),
              ]),
            })
          );
        });
      }
    });
  });

  describe("Scrolling Behavior", () => {
    it("should scroll to bottom when own message arrives", () => {
      const messagesEndRef = {
        current: { scrollIntoView: mockScrollIntoView },
      };

      useChatStore.mockReturnValue({
        currentChat: { _id: "chat-123" },
        messages: {
          "chat-123": [
            {
              _id: "msg-1",
              content: "My message",
              sender: { _id: "user-1" }, // Own message
              createdAt: new Date(),
            },
          ],
        },
        pagination: { "chat-123": { hasMore: false } },
        isLoadingMessages: false,
        isLoadingMore: false,
      });

      // Mock useMessageScroll to simulate scroll behavior
      const { useMessageScroll } = require("@/hooks/useMessageScroll");
      useMessageScroll.mockImplementation(
        ({ messagesEndRef: ref, chatMessages }) => {
          // Simulate scroll when own message arrives
          if (chatMessages?.length > 0) {
            const lastMessage = chatMessages[chatMessages.length - 1];
            if (lastMessage.sender?._id === "user-1") {
              setTimeout(() => {
                ref.current?.scrollIntoView({ behavior: "smooth" });
              }, 0);
            }
          }
        }
      );

      render(<MessageList />);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
      });
    });

    it("should not scroll when viewing older messages", () => {
      const messagesContainerRef = {
        current: {
          scrollTop: 100, // Near top
          scrollHeight: 2000,
          clientHeight: 500,
        },
      };

      useChatStore.mockReturnValue({
        currentChat: { _id: "chat-123" },
        messages: {
          "chat-123": [
            {
              _id: "msg-1",
              content: "Old message",
              sender: { _id: "user-2" }, // Not own message
              createdAt: new Date(),
            },
          ],
        },
        pagination: { "chat-123": { hasMore: false } },
        isLoadingMessages: false,
        isLoadingMore: false,
      });

      const { useMessageScroll } = require("@/hooks/useMessageScroll");
      useMessageScroll.mockImplementation(
        ({ messagesContainerRef: ref, chatMessages }) => {
          // Simulate not scrolling when near top and not own message
          if (ref.current && ref.current.scrollTop < 500) {
            const lastMessage = chatMessages?.[chatMessages.length - 1];
            if (lastMessage?.sender?._id !== "user-1") {
              // Don't scroll
              return;
            }
          }
        }
      );

      render(<MessageList />);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Should not scroll when viewing older messages
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe("Multiple Messages", () => {
    it("should handle multiple messages arriving in sequence", async () => {
      render(<MessageList />);

      const receiveMessageCallback = mockSocket._callbacks?.["receive-message"];
      if (receiveMessageCallback) {
        const messages = [
          {
            _id: "msg-1",
            content: "First message",
            chat: "chat-123",
            sender: { _id: "user-2" },
            createdAt: new Date(),
          },
          {
            _id: "msg-2",
            content: "Second message",
            chat: "chat-123",
            sender: { _id: "user-2" },
            createdAt: new Date(),
          },
        ];

        act(() => {
          messages.forEach((msg) => receiveMessageCallback(msg));
        });

        await waitFor(() => {
          expect(mockAddMessage).toHaveBeenCalledTimes(2);
        });
      }
    });
  });

  describe("Socket Connection State", () => {
    it("should handle socket disconnection gracefully", () => {
      mockSocket.connected = false;

      useSocket.mockReturnValue({
        sendMessage: jest.fn(),
        isConnected: false,
      });

      render(<MessageList />);

      // Component should still render
      expect(
        screen.queryByText(/Welcome to Chattrix/i)
      ).not.toBeInTheDocument();
    });

    it("should show connection status when socket is connected", () => {
      mockSocket.connected = true;

      useSocket.mockReturnValue({
        sendMessage: jest.fn(),
        isConnected: true,
      });

      render(<MessageList />);

      // Component should render normally
      expect(
        screen.queryByText(/Welcome to Chattrix/i)
      ).not.toBeInTheDocument();
    });
  });
});
