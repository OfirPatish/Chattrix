import { render, screen } from "@testing-library/react";
import MessageBubble from "../messages/MessageBubble";
import useAuthStore from "@/store/authStore";

// Mock useAuthStore
jest.mock("@/store/authStore");

describe("MessageBubble", () => {
  const mockUser = { _id: "user1", username: "CurrentUser" };

  beforeEach(() => {
    useAuthStore.mockReturnValue({
      user: mockUser,
    });
  });

  it("should render own message", () => {
    const message = {
      _id: "1",
      content: "Hello",
      sender: { _id: "user1", username: "CurrentUser" },
      createdAt: new Date().toISOString(),
      readBy: [],
    };

    render(<MessageBubble message={message} showAvatar={false} isGrouped={false} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should render received message", () => {
    const message = {
      _id: "1",
      content: "Hi there",
      sender: { _id: "user2", username: "OtherUser" },
      createdAt: new Date().toISOString(),
      readBy: [],
    };

    render(<MessageBubble message={message} showAvatar={true} isGrouped={false} />);

    expect(screen.getByText("Hi there")).toBeInTheDocument();
    expect(screen.getByText("OtherUser")).toBeInTheDocument();
  });

  it("should display read receipt for own messages", () => {
    const message = {
      _id: "1",
      content: "Hello",
      sender: { _id: "user1", username: "CurrentUser" },
      createdAt: new Date().toISOString(),
      readBy: [{ user: "user2", readAt: new Date() }],
    };

    render(<MessageBubble message={message} showAvatar={false} isGrouped={false} />);

    // Check for read receipt icon (CheckCheck) - SVG doesn't have img role, use test-id or query by aria-label
    const readReceipt = screen.getByText("Hello").closest("div")?.querySelector("svg");
    expect(readReceipt).toBeInTheDocument();
  });

  it("should format timestamp correctly", () => {
    const message = {
      _id: "1",
      content: "Hello",
      sender: { _id: "user1", username: "CurrentUser" },
      createdAt: new Date("2024-01-01T14:30:00Z").toISOString(),
      readBy: [],
    };

    render(<MessageBubble message={message} showAvatar={false} isGrouped={false} />);

    // Should display time in HH:MM format (MessageBubble uses hour12: false)
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it("should render image if imageUrl is provided", () => {
    const message = {
      _id: "1",
      content: "Check this out",
      sender: { _id: "user1", username: "CurrentUser" },
      createdAt: new Date().toISOString(),
      imageUrl: "https://example.com/image.jpg",
      readBy: [],
    };

    render(<MessageBubble message={message} showAvatar={false} isGrouped={false} />);

    const image = screen.getByAltText("Message");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });
});

