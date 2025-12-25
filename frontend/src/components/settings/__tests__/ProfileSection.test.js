import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileSection from "../ProfileSection";

// Mock dependencies
jest.mock("@/utils/avatarUtils", () => ({
  getAvatarUrl: jest.fn(() => null),
}));

jest.mock("../AvatarSelector", () => {
  return function MockAvatarSelector() {
    return null;
  };
});

describe("ProfileSection", () => {
  const mockUser = {
    _id: "123",
    username: "testuser",
    email: "test@test.com",
    avatar: null,
  };

  const defaultProps = {
    user: mockUser,
    profileData: {
      username: "testuser",
      email: "test@test.com",
      avatar: null,
    },
    setProfileData: jest.fn(),
    isEditing: false,
    setIsEditing: jest.fn(),
    onUpdateProfile: jest.fn(),
    isButtonLoading: false,
    error: null,
    fieldErrors: {},
    clearError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render user profile information", () => {
    render(<ProfileSection {...defaultProps} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
  });

  it("should show edit button when not editing", () => {
    render(<ProfileSection {...defaultProps} />);

    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });

  it("should show edit form when editing", () => {
    render(<ProfileSection {...defaultProps} isEditing={true} />);

    // Input doesn't have id/htmlFor association, so use placeholder or value
    expect(screen.getByPlaceholderText("Your username")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("should call setIsEditing when edit button is clicked", async () => {
    const user = userEvent.setup();
    const mockSetIsEditing = jest.fn();
    const mockSetProfileData = jest.fn();

    render(
      <ProfileSection
        {...defaultProps}
        setIsEditing={mockSetIsEditing}
        setProfileData={mockSetProfileData}
      />
    );

    const editButton = screen.getByText("Edit Profile");
    await user.click(editButton);

    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
    expect(mockSetProfileData).toHaveBeenCalled();
  });

  it("should display error message", () => {
    render(
      <ProfileSection
        {...defaultProps}
        isEditing={true}
        error="Update failed"
      />
    );

    expect(screen.getByText("Update failed")).toBeInTheDocument();
  });

  it("should display field-specific errors", () => {
    render(
      <ProfileSection
        {...defaultProps}
        isEditing={true}
        fieldErrors={{ username: "Username is required" }}
      />
    );

    expect(screen.getByText("Username is required")).toBeInTheDocument();
  });

  it("should call onUpdateProfile when save button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnUpdateProfile = jest.fn();

    render(
      <ProfileSection
        {...defaultProps}
        isEditing={true}
        onUpdateProfile={mockOnUpdateProfile}
      />
    );

    const saveButton = screen.getByText("Save Changes");
    await user.click(saveButton);

    expect(mockOnUpdateProfile).toHaveBeenCalledTimes(1);
  });

  it("should show loading state when saving", () => {
    render(
      <ProfileSection
        {...defaultProps}
        isEditing={true}
        isButtonLoading={true}
      />
    );

    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });
});

