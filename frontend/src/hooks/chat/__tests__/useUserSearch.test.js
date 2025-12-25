import { renderHook, waitFor, act } from "@testing-library/react";
import { useUserSearch } from "../useUserSearch";
import { userAPI } from "@/lib/api";

// Mock API
jest.mock("@/lib/api");

describe("useUserSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should not search if term is less than 2 characters", async () => {
    const { result } = renderHook(() => useUserSearch());

    act(() => {
      result.current.setSearchTerm("a");
    });

    await waitFor(() => {
      expect(result.current.users).toEqual([]);
    });

    expect(userAPI.getUsers).not.toHaveBeenCalled();
  });

  it("should search users with debounce", async () => {
    userAPI.getUsers.mockResolvedValue({
      success: true,
      data: [
        { _id: "1", username: "user1", email: "user1@test.com" },
        { _id: "2", username: "user2", email: "user2@test.com" },
      ],
    });

    const { result } = renderHook(() => useUserSearch());

    act(() => {
      result.current.setSearchTerm("user");
    });

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.users).toHaveLength(2);
    });

    expect(userAPI.getUsers).toHaveBeenCalledWith("user");
  });

  it("should handle search error", async () => {
    userAPI.getUsers.mockRejectedValue(new Error("Search failed"));

    const { result } = renderHook(() => useUserSearch());

    act(() => {
      result.current.setSearchTerm("user");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.users).toEqual([]);
  });

  it("should reset search", () => {
    const { result } = renderHook(() => useUserSearch());

    act(() => {
      result.current.setSearchTerm("user");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});

