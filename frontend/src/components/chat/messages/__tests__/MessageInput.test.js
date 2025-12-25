import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageInput from "../MessageInput";
import useChatStore from "@/store/chatStore";
import { useSocket } from "@/hooks/useSocket";

// Mock dependencies
jest.mock("@/store/chatStore");
jest.mock("@/hooks/useSocket");

describe("MessageInput", () => {
  const mockSendMessage = jest.fn();
  const mockStartTyping = jest.fn();
  const mockStopTyping = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    useSocket.mockReturnValue({
      sendMessage: mockSendMessage,
      startTyping: mockStartTyping,
      stopTyping: mockStopTyping,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should not render if no current chat", () => {
    useChatStore.mockReturnValue({
      currentChat: null,
    });

    const { container } = render(<MessageInput />);
    expect(container.firstChild).toBeNull();
  });

  it("should render input when current chat exists", () => {
    useChatStore.mockReturnValue({
      currentChat: { _id: "chat1" },
    });

    render(<MessageInput />);

    expect(screen.getByPlaceholderText("Type a message...")).toBeInTheDocument();
  });

  it("should send message on form submit", async () => {
    const user = userEvent.setup({ delay: null });
    useChatStore.mockReturnValue({
      currentChat: { _id: "chat1" },
    });

    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message...");
    const sendButton = screen.getByLabelText("Send message");

    await user.type(input, "Hello");
    await user.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith("chat1", "Hello");
  });

  it("should send message on Enter key", async () => {
    const user = userEvent.setup({ delay: null });
    useChatStore.mockReturnValue({
      currentChat: { _id: "chat1" },
    });

    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message...");
    await user.type(input, "Hello{Enter}");

    expect(mockSendMessage).toHaveBeenCalledWith("chat1", "Hello");
  });

  it("should not send empty message", async () => {
    const user = userEvent.setup({ delay: null });
    useChatStore.mockReturnValue({
      currentChat: { _id: "chat1" },
    });

    render(<MessageInput />);

    const sendButton = screen.getByLabelText("Send message");
    await user.click(sendButton);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("should start typing indicator when user types", async () => {
    const user = userEvent.setup({ delay: null });
    useChatStore.mockReturnValue({
      currentChat: { _id: "chat1" },
    });

    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message...");
    await user.type(input, "H");

    expect(mockStartTyping).toHaveBeenCalledWith("chat1");
  });

  it("should disable send button when sending", () => {
    useChatStore.mockReturnValue({
      currentChat: { _id: "chat1" },
    });

    render(<MessageInput />);

    const sendButton = screen.getByLabelText("Send message");
    expect(sendButton).toBeDisabled();
  });
});

