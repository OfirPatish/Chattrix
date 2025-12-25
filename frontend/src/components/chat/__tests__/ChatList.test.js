// Mock @dicebear/core before other imports
jest.mock("@dicebear/core", () => ({
  createAvatar: jest.fn(() => ({
    toString: jest.fn(() => "<svg>test</svg>"),
  })),
}));

jest.mock("@dicebear/collection", () => ({
  avataaars: jest.fn(),
  identicon: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatList from "../list/ChatList";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import { useSocket } from "@/hooks/useSocket";

// Mock dependencies
jest.mock("@/store/chatStore");
jest.mock("@/store/authStore");
jest.mock("@/hooks/useSocket");

describe("ChatList", () => {
  const mockOnCloseMobile = jest.fn();
  const mockOnNewChat = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useSocket.mockReturnValue({ isConnected: true });
  });

  it("should render chat list header", () => {
    useChatStore.mockReturnValue({
      chats: [],
      currentChat: null,
      setCurrentChat: jest.fn(),
      fetchChats: jest.fn(),
      messages: {},
      error: null,
      hasInitiallyFetched: true,
    });
    useAuthStore.mockReturnValue({
      user: { _id: "user1" },
    });

    render(
      <ChatList onCloseMobile={mockOnCloseMobile} onNewChat={mockOnNewChat} />
    );

    expect(screen.getByText("Chats")).toBeInTheDocument();
    expect(screen.getByText("New Chat")).toBeInTheDocument();
  });

  it("should display connection status", () => {
    useChatStore.mockReturnValue({
      chats: [],
      currentChat: null,
      setCurrentChat: jest.fn(),
      fetchChats: jest.fn(),
      messages: {},
      error: null,
      hasInitiallyFetched: true,
    });
    useAuthStore.mockReturnValue({
      user: { _id: "user1" },
    });
    useSocket.mockReturnValue({ isConnected: true });

    render(
      <ChatList onCloseMobile={mockOnCloseMobile} onNewChat={mockOnNewChat} />
    );

    const statusIndicator = screen.getByTitle("Connected");
    expect(statusIndicator).toBeInTheDocument();
  });

  it("should display empty state when no chats", () => {
    useChatStore.mockReturnValue({
      chats: [],
      currentChat: null,
      setCurrentChat: jest.fn(),
      fetchChats: jest.fn(),
      messages: {},
      error: null,
      hasInitiallyFetched: true,
    });
    useAuthStore.mockReturnValue({
      user: { _id: "user1" },
    });

    render(
      <ChatList onCloseMobile={mockOnCloseMobile} onNewChat={mockOnNewChat} />
    );

    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
  });

  it("should render chat list items", () => {
    const mockChats = [
      {
        _id: "chat1",
        participants: [
          { _id: "user1", username: "User1" },
          { _id: "user2", username: "User2" },
        ],
        lastMessage: {
          content: "Hello",
          createdAt: new Date().toISOString(),
        },
      },
    ];

    useChatStore.mockReturnValue({
      chats: mockChats,
      currentChat: null,
      setCurrentChat: jest.fn(),
      fetchChats: jest.fn(),
      messages: {},
      error: null,
      hasInitiallyFetched: true,
    });
    useAuthStore.mockReturnValue({
      user: { _id: "user1" },
    });

    render(
      <ChatList onCloseMobile={mockOnCloseMobile} onNewChat={mockOnNewChat} />
    );

    expect(screen.getByText("User2")).toBeInTheDocument();
  });

  it("should call onNewChat when New Chat button is clicked", async () => {
    const user = userEvent.setup();
    useChatStore.mockReturnValue({
      chats: [],
      currentChat: null,
      setCurrentChat: jest.fn(),
      fetchChats: jest.fn(),
      messages: {},
      error: null,
      hasInitiallyFetched: true,
    });
    useAuthStore.mockReturnValue({
      user: { _id: "user1" },
    });

    render(
      <ChatList onCloseMobile={mockOnCloseMobile} onNewChat={mockOnNewChat} />
    );

    const newChatButton = screen.getByText("New Chat");
    await user.click(newChatButton);

    expect(mockOnNewChat).toHaveBeenCalledTimes(1);
  });
});

