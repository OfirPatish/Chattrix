import { renderHook, act, waitFor } from "@testing-library/react";
import { useSettings } from "../useSettings";
import { userAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";

// Mock dependencies
jest.mock("@/lib/api");
const mockSetUser = jest.fn();
jest.mock("@/store/authStore", () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      user: null,
    })),
  };
});

describe("useSettings", () => {
  const mockUser = {
    _id: "123",
    username: "testuser",
    email: "test@test.com",
    avatar: "avatar-url",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useAuthStore as a function that returns the hook result
    useAuthStore.mockReturnValue({
      user: mockUser,
    });
    // Mock getState for useAuthStore.getState() calls
    useAuthStore.getState = jest.fn(() => ({
      user: mockUser,
      setUser: mockSetUser,
    }));
  });

  it("should initialize with user data", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.profileData.username).toBe("testuser");
    expect(result.current.profileData.email).toBe("test@test.com");
  });

  it("should update profile successfully", async () => {
    userAPI.updateProfile.mockResolvedValue({
      success: true,
      data: {
        ...mockUser,
        username: "updateduser",
      },
    });

    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setIsEditing(true);
      result.current.setProfileData({
        ...result.current.profileData,
        username: "updateduser",
      });
    });

    await act(async () => {
      await result.current.handleUpdateProfile();
    });

    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
    });

    expect(userAPI.updateProfile).toHaveBeenCalledWith({
      username: "updateduser",
      avatar: "avatar-url",
    });
  });

  it("should handle update profile error", async () => {
    userAPI.updateProfile.mockRejectedValue({
      response: {
        data: {
          errors: [{ msg: "Username already taken", param: "username" }],
        },
      },
    });

    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setIsEditing(true);
      result.current.setProfileData({
        ...result.current.profileData,
        username: "takenusername",
      });
    });

    await act(async () => {
      await result.current.handleUpdateProfile();
    });

    await waitFor(() => {
      expect(result.current.fieldErrors.username).toBeTruthy();
    });
  });

  it("should clear error", async () => {
    userAPI.updateProfile.mockRejectedValue({
      response: {
        data: {
          message: "Test error",
        },
      },
    });

    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setIsEditing(true);
    });

    await act(async () => {
      await result.current.handleUpdateProfile();
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});

