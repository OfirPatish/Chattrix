import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { useSocket } from "../useSocket";
import useAuthStore from "@/store/authStore";
import {
  getSocketInstance,
  getConnectionState,
  getSocketInstanceRef,
  disconnectSocket,
  sendMessage as sendMessageAction,
  socketActions,
} from "../socketManager";

// Mock dependencies
jest.mock("@/store/authStore");
jest.mock("../socketManager");

describe("useSocket", () => {
  const mockSocket = {
    connected: false,
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };

  const mockGetState = jest.fn(() => ({
    isConnected: false,
    listeners: new Set(),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    getConnectionState.mockReturnValue({
      isConnected: false,
      listeners: new Set(),
      add: jest.fn(),
      delete: jest.fn(),
    });
    getSocketInstanceRef.mockReturnValue(null);
    getSocketInstance.mockReturnValue(mockSocket);
    useAuthStore.mockReturnValue({
      accessToken: "test-token",
      user: { _id: "user-123" },
    });
  });

  afterEach(() => {
    disconnectSocket();
  });

  it("should initialize with connection state", () => {
    getConnectionState.mockReturnValue({
      isConnected: true,
      listeners: new Set(),
    });

    const { result } = renderHook(() => useSocket());

    expect(result.current.isConnected).toBe(true);
  });

  it("should get socket instance when accessToken and user exist", () => {
    renderHook(() => useSocket());

    expect(getSocketInstance).toHaveBeenCalledWith("test-token");
  });

  it("should disconnect socket when no accessToken", () => {
    useAuthStore.mockReturnValue({
      accessToken: null,
      user: { _id: "user-123" },
    });
    getSocketInstanceRef.mockReturnValue(mockSocket);

    renderHook(() => useSocket());

    expect(disconnectSocket).toHaveBeenCalled();
  });

  it("should disconnect socket when no user", () => {
    useAuthStore.mockReturnValue({
      accessToken: "test-token",
      user: null,
    });
    getSocketInstanceRef.mockReturnValue(mockSocket);

    renderHook(() => useSocket());

    expect(disconnectSocket).toHaveBeenCalled();
  });

  it("should register connection state listener", () => {
    const mockListeners = new Set();
    let addedListener = null;

    getConnectionState.mockReturnValue({
      isConnected: false,
      listeners: mockListeners,
      add: jest.fn((listener) => {
        mockListeners.add(listener);
        addedListener = listener;
      }),
      delete: jest.fn((listener) => {
        mockListeners.delete(listener);
      }),
    });

    const { unmount } = renderHook(() => useSocket());

    // The listener should be added when the hook mounts
    expect(mockListeners.size).toBeGreaterThan(0);
    expect(addedListener).toBeDefined();

    unmount();

    // Listener should be removed on unmount
    expect(mockListeners.size).toBe(0);
  });

  it("should provide sendMessage function", () => {
    const { result } = renderHook(() => useSocket());

    expect(typeof result.current.sendMessage).toBe("function");

    result.current.sendMessage("chat-123", "Hello");

    expect(sendMessageAction).toHaveBeenCalledWith(
      "chat-123",
      "Hello",
      "text",
      ""
    );
  });

  it("should provide socket actions", () => {
    const { result } = renderHook(() => useSocket());

    expect(result.current.startTyping).toBe(socketActions.startTyping);
    expect(result.current.stopTyping).toBe(socketActions.stopTyping);
    expect(result.current.markAsRead).toBe(socketActions.markAsRead);
    expect(result.current.joinChat).toBe(socketActions.joinChat);
    expect(result.current.leaveChat).toBe(socketActions.leaveChat);
  });

  it("should update connection state when socket connects", async () => {
    const mockListeners = new Set();
    let setIsConnectedCallback = null;

    getConnectionState.mockReturnValue({
      isConnected: false,
      listeners: mockListeners,
      add: jest.fn((callback) => {
        mockListeners.add(callback);
        setIsConnectedCallback = callback;
      }),
      delete: jest.fn((callback) => mockListeners.delete(callback)),
    });

    mockSocket.connected = false;

    const { result } = renderHook(() => useSocket());

    expect(result.current.isConnected).toBe(false);

    // Simulate socket connection by calling the callback directly
    if (setIsConnectedCallback) {
      act(() => {
        setIsConnectedCallback(true);
      });
    } else {
      // If callback wasn't captured, manually trigger via listeners
      mockListeners.forEach((callback) => {
        act(() => {
          callback(true);
        });
      });
    }

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });

  it("should handle token change", () => {
    const { rerender } = renderHook(() => useSocket());

    expect(getSocketInstance).toHaveBeenCalledWith("test-token");

    useAuthStore.mockReturnValue({
      accessToken: "new-token",
      user: { _id: "user-123" },
    });

    rerender();

    expect(getSocketInstance).toHaveBeenCalledWith("new-token");
  });

  it("should memoize sendMessage function", () => {
    const { result, rerender } = renderHook(() => useSocket());

    const sendMessage1 = result.current.sendMessage;

    rerender();

    const sendMessage2 = result.current.sendMessage;

    // Function should be memoized (same reference)
    expect(sendMessage1).toBe(sendMessage2);
  });

  it("should send message with all parameters", () => {
    const { result } = renderHook(() => useSocket());

    result.current.sendMessage(
      "chat-123",
      "Hello",
      "image",
      "https://example.com/image.jpg"
    );

    expect(sendMessageAction).toHaveBeenCalledWith(
      "chat-123",
      "Hello",
      "image",
      "https://example.com/image.jpg"
    );
  });
});
