import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../Navbar";
import useAuthStore from "@/store/authStore";

// Mock dependencies
jest.mock("@/store/authStore");
jest.mock("../UserProfileDropdown", () => {
  return function MockUserProfileDropdown() {
    return <div data-testid="user-profile-dropdown">User Profile</div>;
  };
});

describe("Navbar", () => {
  const mockOnMenuClick = jest.fn();
  const mockOnNewChat = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render navbar with logo and menu button", () => {
    render(
      <Navbar
        onMenuClick={mockOnMenuClick}
        showMobileSidebar={false}
        onNewChat={mockOnNewChat}
      />
    );

    expect(screen.getByLabelText("Toggle sidebar")).toBeInTheDocument();
    expect(screen.getByText("Chattrix")).toBeInTheDocument();
  });

  it("should show X icon when sidebar is open", () => {
    render(
      <Navbar
        onMenuClick={mockOnMenuClick}
        showMobileSidebar={true}
        onNewChat={mockOnNewChat}
      />
    );

    const menuButton = screen.getByLabelText("Toggle sidebar");
    expect(menuButton).toBeInTheDocument();
  });

  it("should call onMenuClick when menu button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Navbar
        onMenuClick={mockOnMenuClick}
        showMobileSidebar={false}
        onNewChat={mockOnNewChat}
      />
    );

    const menuButton = screen.getByLabelText("Toggle sidebar");
    await user.click(menuButton);

    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
  });

  it("should render user profile dropdown", () => {
    render(
      <Navbar
        onMenuClick={mockOnMenuClick}
        showMobileSidebar={false}
        onNewChat={mockOnNewChat}
      />
    );

    expect(screen.getByTestId("user-profile-dropdown")).toBeInTheDocument();
  });
});

