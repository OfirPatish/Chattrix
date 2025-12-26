import { io } from "socket.io-client";
import {
  getSocketInstance,
  disconnectSocket,
  getConnectionState,
  sendMessage,
  socketActions,
  setupMessageListeners,
} from "../socketManager";
import useChatStore from "@/store/chatStore";

// Mock socket.io-client
jest.mock("socket.io-client");

// Mock chat store
let mockStore, mockStoreFunctions;

jest.mock("@/store/chatStore", () => {
  const mockStoreFunctions = {
    addMessage: jest.fn(),
    updateChat: jest.fn(),
    updateMessage: jest.fn(),
    updateUserStatus: jest.fn(),
  };

  const mockStore = {
    ...mockStoreFunctions,
    currentChat: null,
    messages: {},
    getState: jest.fn(() => ({
      addMessage: mockStoreFunctions.addMessage,
      updateChat: mockStoreFunctions.updateChat,
      updateMessage: mockStoreFunctions.updateMessage,
      updateUserStatus: mockStoreFunctions.updateUserStatus,
      get currentChat() {
        return mockStore.currentChat;
      },
      get messages() {
        return mockStore.messages;
      },
    })),
  };

  // Export to module scope for test access
  if (typeof global !== "undefined") {
    global.__mockStore = mockStore;
    global.__mockStoreFunctions = mockStoreFunctions;
  }

  return {
    __esModule: true,
    default: mockStore,
  };
});

// Get references after mock is set up
beforeAll(() => {
  mockStore = global.__mockStore;
  mockStoreFunctions = global.__mockStoreFunctions;
});

describe("socketManager", () => {
  let mockSocket;
  let mockEmit;
  let mockOn;
  let mockOff;
  let mockDisconnect;
  let mockRemoveAllListeners;
  let mockConnect;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset module state by clearing socket instance
    disconnectSocket();

    // Setup mock socket
    mockEmit = jest.fn();
    mockOn = jest.fn();
    mockOff = jest.fn();
    mockDisconnect = jest.fn();
    mockRemoveAllListeners = jest.fn();
    mockConnect = jest.fn();

    mockSocket = {
      connected: false,
      emit: mockEmit,
      on: mockOn,
      off: mockOff,
      disconnect: mockDisconnect,
      removeAllListeners: mockRemoveAllListeners,
      connect: mockConnect,
    };

    io.mockReturnValue(mockSocket);
  });

  afterEach(() => {
    jest.useRealTimers();
    disconnectSocket();
  });

  describe("Socket Connection", () => {
    it("should create socket instance with access token", () => {
      const token = "test-token-123";
      getSocketInstance(token);

      expect(io).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          auth: { token },
          transports: ["websocket", "polling"],
          reconnection: true,
        })
      );
    });

    it("should not create socket if no access token", () => {
      const socket = getSocketInstance(null);
      expect(socket).toBeNull();
    });

    it("should reuse existing socket instance with same token", () => {
      const token = "test-token-123";
      const socket1 = getSocketInstance(token);
      const socket2 = getSocketInstance(token);

      expect(socket1).toBe(socket2);
      expect(io).toHaveBeenCalledTimes(1);
    });

    it("should disconnect and recreate socket when token changes", () => {
      const token1 = "token-1";
      const token2 = "token-2";

      getSocketInstance(token1);
      expect(io).toHaveBeenCalledTimes(1);

      getSocketInstance(token2);
      expect(mockDisconnect).toHaveBeenCalled();
      expect(io).toHaveBeenCalledTimes(2);
    });

    it("should set up connection listeners on socket creation", () => {
      const token = "test-token";
      getSocketInstance(token);

      // Verify connection event listeners are set up
      expect(mockOn).toHaveBeenCalledWith("connect", expect.any(Function));
      expect(mockOn).toHaveBeenCalledWith("disconnect", expect.any(Function));
      expect(mockOn).toHaveBeenCalledWith(
        "connect_error",
        expect.any(Function)
      );
      expect(mockOn).toHaveBeenCalledWith("error", expect.any(Function));
    });

    it("should update connection state on connect", () => {
      const token = "test-token";
      getSocketInstance(token);

      // Find the connect handler
      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "connect"
      )?.[1];

      expect(connectHandler).toBeDefined();

      // Simulate connection
      mockSocket.connected = true;
      connectHandler();

      const state = getConnectionState();
      expect(state.isConnected).toBe(true);
    });

    it("should update connection state on disconnect", () => {
      const token = "test-token";
      getSocketInstance(token);

      // Find the disconnect handler
      const disconnectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "disconnect"
      )?.[1];

      expect(disconnectHandler).toBeDefined();

      // Simulate disconnection
      mockSocket.connected = false;
      disconnectHandler("io server disconnect");

      const state = getConnectionState();
      expect(state.isConnected).toBe(false);
    });
  });

  describe("Message Listeners", () => {
    it("should set up message listeners when socket connects", async () => {
      jest.useRealTimers();
      const token = "test-token";
      getSocketInstance(token);

      // Find the connect handler
      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "connect"
      )?.[1];

      mockSocket.connected = true;
      connectHandler();

      // Wait for dynamic import to resolve
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify message listeners are set up (check all calls)
      const allEventNames = mockOn.mock.calls.map((call) => call[0]);
      expect(allEventNames).toContain("receive-message");
      expect(allEventNames).toContain("message-read");
      expect(allEventNames).toContain("user-online");
      expect(allEventNames).toContain("user-offline");
      expect(allEventNames).toContain("typing-start");
      expect(allEventNames).toContain("typing-stopped");
      jest.useFakeTimers();
    });

    it("should handle receive-message event", async () => {
      jest.useRealTimers();
      const token = "test-token";
      getSocketInstance(token);

      // Simulate connection
      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "connect"
      )?.[1];
      mockSocket.connected = true;
      connectHandler();

      // Wait for dynamic import
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Find receive-message handler
      const receiveMessageHandler = mockOn.mock.calls.find(
        (call) => call[0] === "receive-message"
      )?.[1];

      expect(receiveMessageHandler).toBeDefined();

      const testMessage = {
        _id: "msg-123",
        content: "Hello",
        chat: "chat-456",
        sender: { _id: "user-789" },
        createdAt: new Date(),
      };

      receiveMessageHandler(testMessage);

      expect(mockStoreFunctions.addMessage).toHaveBeenCalledWith(
        "chat-456",
        testMessage
      );
      expect(mockStoreFunctions.updateChat).toHaveBeenCalledWith("chat-456", {
        lastMessage: testMessage,
      });
      jest.useFakeTimers();
    });

    it("should handle receive-message with populated chat object", async () => {
      jest.useRealTimers();
      const token = "test-token";
      getSocketInstance(token);

      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "connect"
      )?.[1];
      mockSocket.connected = true;
      connectHandler();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const receiveMessageHandler = mockOn.mock.calls.find(
        (call) => call[0] === "receive-message"
      )?.[1];

      expect(receiveMessageHandler).toBeDefined();

      const testMessage = {
        _id: "msg-123",
        content: "Hello",
        chat: { _id: "chat-456" },
        sender: { _id: "user-789" },
      };

      receiveMessageHandler(testMessage);

      expect(mockStoreFunctions.addMessage).toHaveBeenCalledWith(
        "chat-456",
        testMessage
      );
      jest.useFakeTimers();
    });

    it("should handle message-read event", async () => {
      jest.useRealTimers();
      const token = "test-token";
      getSocketInstance(token);

      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "connect"
      )?.[1];
      mockSocket.connected = true;
      connectHandler();

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Mock current chat and messages
      mockStore.currentChat = { _id: "chat-456" };
      mockStore.messages = {
        "chat-456": [
          {
            _id: "msg-123",
            content: "Hello",
            readBy: [],
          },
        ],
      };

      const messageReadHandler = mockOn.mock.calls.find(
        (call) => call[0] === "message-read"
      )?.[1];

      expect(messageReadHandler).toBeDefined();

      messageReadHandler({ messageId: "msg-123", userId: "user-789" });

      expect(mockStoreFunctions.updateMessage).toHaveBeenCalledWith(
        "chat-456",
        "msg-123",
        expect.objectContaining({
          readBy: expect.arrayContaining([
            expect.objectContaining({ user: "user-789" }),
          ]),
        })
      );
      jest.useFakeTimers();
    });
  });

  describe("Online Status", () => {
    it("should handle user-online event", async () => {
      jest.useRealTimers();
      const token = "test-token";
      getSocketInstance(token);

      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "connect"
      )?.[1];
      mockSocket.connected = true;
      connectHandler();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const userOnlineHandler = mockOn.mock.calls.find(
        (call) => call[0] === "user-online"
      )?.[1];

      expect(userOnlineHandler).toBeDefined();

      userOnlineHandler({ userId: "user-123", isOnline: true });

      expect(mockStoreFunctions.updateUserStatus).toHaveBeenCalledWith(
        "user-123",
        expect.objectContaining({
          isOnline: true,
          lastSeen: expect.any(Date),
        })
      );
      jest.useFakeTimers();
    });

    it("should handle user-offline event", async () => {
      jest.useRealTimers();
      const token = "test-token";
      getSocketInstance(token);

      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "connect"
      )?.[1];
      mockSocket.connected = true;
      connectHandler();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const userOfflineHandler = mockOn.mock.calls.find(
        (call) => call[0] === "user-offline"
      )?.[1];

      expect(userOfflineHandler).toBeDefined();

      userOfflineHandler({ userId: "user-123", isOnline: false });

      expect(mockStoreFunctions.updateUserStatus).toHaveBeenCalledWith(
        "user-123",
        expect.objectContaining({
          isOnline: false,
          lastSeen: expect.any(Date),
        })
      );
      jest.useFakeTimers();
    });
  });

  describe("Typing Indicators", () => {
    it("should handle typing-start event", async () => {
      jest.useRealTimers();
      const token = "test-token";
      getSocketInstance(token);

      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "connect"
      )?.[1];
      mockSocket.connected = true;
      connectHandler();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const typingStartHandler = mockOn.mock.calls.find(
        (call) => call[0] === "typing-start"
      )?.[1];

      expect(typingStartHandler).toBeDefined();

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      typingStartHandler({ userId: "user-123", username: "testuser" });

      expect(consoleSpy).toHaveBeenCalledWith("User testuser is typing...");

      consoleSpy.mockRestore();
      jest.useFakeTimers();
    });

    it("should handle typing-stopped event", async () => {
      jest.useRealTimers();
      const token = "test-token";
      getSocketInstance(token);

      const connectHandler = mockOn.mock.calls.find(
        (call) => call[0] === "connect"
      )?.[1];
      mockSocket.connected = true;
      connectHandler();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const typingStoppedHandler = mockOn.mock.calls.find(
        (call) => call[0] === "typing-stopped"
      )?.[1];

      expect(typingStoppedHandler).toBeDefined();

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      typingStoppedHandler({ userId: "user-123", username: "testuser" });

      expect(consoleSpy).toHaveBeenCalledWith("User testuser stopped typing");

      consoleSpy.mockRestore();
      jest.useFakeTimers();
    });
  });

  describe("Sending Messages", () => {
    it("should send message when socket is connected", () => {
      const token = "test-token";
      getSocketInstance(token);
      mockSocket.connected = true;

      sendMessage("chat-123", "Hello World");

      expect(mockEmit).toHaveBeenCalledWith("send-message", {
        chatId: "chat-123",
        content: "Hello World",
        messageType: "text",
        imageUrl: "",
      });
    });

    it("should not send message when socket is not connected", () => {
      const token = "test-token";
      getSocketInstance(token);
      mockSocket.connected = false;

      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      sendMessage("chat-123", "Hello World");

      expect(mockEmit).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Socket not connected, cannot send message"
      );

      consoleSpy.mockRestore();
    });

    it("should prevent duplicate messages within 1 second", () => {
      const token = "test-token";
      getSocketInstance(token);
      mockSocket.connected = true;

      sendMessage("chat-123", "Hello");
      sendMessage("chat-123", "Hello"); // Duplicate

      // Should only emit once
      expect(mockEmit).toHaveBeenCalledTimes(1);
    });

    it("should allow same message after 1 second", () => {
      const token = "test-token";
      // Advance time to clear any previous test's lastSentMessage
      jest.advanceTimersByTime(2000);

      // Set connected before getting instance
      mockSocket.connected = true;
      const socket = getSocketInstance(token);
      // Ensure socketInstance is set
      expect(socket).toBe(mockSocket);

      // Verify socket is connected
      expect(mockSocket.connected).toBe(true);

      // First message
      sendMessage("chat-123", "Hello");
      expect(mockEmit).toHaveBeenCalledTimes(1);

      // Advance time past duplicate window (1001ms)
      // Note: Date.now() should advance with fake timers
      jest.advanceTimersByTime(1001);

      // Second message should be allowed now (time has passed)
      sendMessage("chat-123", "Hello");
      expect(mockEmit).toHaveBeenCalledTimes(2);
    });

    it("should send message with custom type and image", () => {
      const token = "test-token";
      getSocketInstance(token);
      mockSocket.connected = true;

      sendMessage(
        "chat-123",
        "Check this out",
        "image",
        "https://example.com/image.jpg"
      );

      expect(mockEmit).toHaveBeenCalledWith("send-message", {
        chatId: "chat-123",
        content: "Check this out",
        messageType: "image",
        imageUrl: "https://example.com/image.jpg",
      });
    });
  });

  describe("Socket Actions", () => {
    beforeEach(() => {
      const token = "test-token";
      getSocketInstance(token);
    });

    it("should emit startTyping when connected", () => {
      mockSocket.connected = true;
      socketActions.startTyping("chat-123");

      expect(mockEmit).toHaveBeenCalledWith("typing-start", {
        chatId: "chat-123",
      });
    });

    it("should not emit startTyping when disconnected", () => {
      mockSocket.connected = false;
      socketActions.startTyping("chat-123");

      expect(mockEmit).not.toHaveBeenCalled();
    });

    it("should emit stopTyping when connected", () => {
      mockSocket.connected = true;
      socketActions.stopTyping("chat-123");

      expect(mockEmit).toHaveBeenCalledWith("typing-stop", {
        chatId: "chat-123",
      });
    });

    it("should emit markAsRead when connected", () => {
      mockSocket.connected = true;
      socketActions.markAsRead("msg-123");

      expect(mockEmit).toHaveBeenCalledWith("mark-read", {
        messageId: "msg-123",
      });
    });

    it("should emit joinChat when connected", () => {
      mockSocket.connected = true;
      socketActions.joinChat("chat-123");

      expect(mockEmit).toHaveBeenCalledWith("join-chat", "chat-123");
    });

    it("should emit leaveChat when connected", () => {
      mockSocket.connected = true;
      socketActions.leaveChat("chat-123");

      expect(mockEmit).toHaveBeenCalledWith("leave-chat", "chat-123");
    });
  });

  describe("Disconnect", () => {
    it("should disconnect socket and clean up", () => {
      const token = "test-token";
      getSocketInstance(token);
      mockSocket.connected = true;

      disconnectSocket();

      expect(mockRemoveAllListeners).toHaveBeenCalled();
      expect(mockDisconnect).toHaveBeenCalled();

      const state = getConnectionState();
      expect(state.isConnected).toBe(false);
    });

    it("should handle disconnect when no socket exists", () => {
      // Should not throw
      expect(() => disconnectSocket()).not.toThrow();
    });
  });
});
