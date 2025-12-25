import { renderHook, act, waitFor } from "@testing-library/react";
import { useUserProfile } from "../useUserProfile";
import { userAPI } from "@/lib/api";

// Mock API
jest.mock("@/lib/api");

describe("useUserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch user profile when handleViewProfile is called", async () => {
    const mockUser = {
      _id: "user1",
      username: "testuser",
      email: "test@test.com",
    };

    userAPI.getUserById.mockResolvedValue({
      success: true,
      data: mockUser,
    });

    const { result } = renderHook(() => useUserProfile());

    await act(async () => {
      await result.current.handleViewProfile("user1");
    });

    await waitFor(() => {
      expect(result.current.showUserProfile).toBe(true);
    });

    expect(result.current.userDetails).toEqual(mockUser);
    expect(userAPI.getUserById).toHaveBeenCalledWith("user1");
  });

  it("should use cached data if same user is requested again", async () => {
    const mockUser = {
      _id: "user1",
      username: "testuser",
    };

    userAPI.getUserById.mockResolvedValue({
      success: true,
      data: mockUser,
    });

    const { result } = renderHook(() => useUserProfile());

    // First call
    await act(async () => {
      await result.current.handleViewProfile("user1");
    });

    // Second call - should use cache
    await act(async () => {
      await result.current.handleViewProfile("user1");
    });

    // Should only call API once
    expect(userAPI.getUserById).toHaveBeenCalledTimes(1);
  });

  it("should close profile", () => {
    const { result } = renderHook(() => useUserProfile());

    act(() => {
      result.current.closeProfile();
    });

    expect(result.current.showUserProfile).toBe(false);
  });

  it("should handle fetch error", async () => {
    userAPI.getUserById.mockRejectedValue(new Error("Failed to fetch"));

    const { result } = renderHook(() => useUserProfile());

    await act(async () => {
      await result.current.handleViewProfile("user1");
    });

    // Should not show profile on error
    expect(result.current.showUserProfile).toBe(false);
  });
});

