import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmptyState from "../EmptyState";
import { MessageCircle } from "lucide-react";

describe("EmptyState", () => {
  it("should render title and description", () => {
    render(
      <EmptyState
        icon={<MessageCircle />}
        title="No messages"
        description="Start a conversation"
      />
    );

    expect(screen.getByText("No messages")).toBeInTheDocument();
    expect(screen.getByText("Start a conversation")).toBeInTheDocument();
  });

  it("should render action button when onAction is provided", async () => {
    const mockOnAction = jest.fn();
    const user = userEvent.setup();

    render(
      <EmptyState
        icon={<MessageCircle />}
        title="No messages"
        description="Start a conversation"
        onAction={mockOnAction}
        actionLabel="New Chat"
      />
    );

    const button = screen.getByText("New Chat");
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  it("should not render action button when onAction is not provided", () => {
    render(
      <EmptyState
        icon={<MessageCircle />}
        title="No messages"
        description="Start a conversation"
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render icon", () => {
    render(
      <EmptyState
        icon={<MessageCircle data-testid="icon" />}
        title="No messages"
      />
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});

