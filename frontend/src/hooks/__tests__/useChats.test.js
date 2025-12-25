import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useChats, useCreateChat } from "../useChats";
import { chatAPI } from "@/lib/api";

// Mock API
jest.mock("@/lib/api");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useChats hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useChats", () => {
    it("should fetch chats successfully", async () => {
      chatAPI.getChats.mockResolvedValue({
        success: true,
        data: [
          {
            _id: "1",
            participants: [],
            lastMessage: null,
          },
        ],
      });

      const { result } = renderHook(() => useChats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(chatAPI.getChats).toHaveBeenCalled();
    });

    it("should handle fetch error", async () => {
      chatAPI.getChats.mockRejectedValue(new Error("Failed to fetch"));

      const { result } = renderHook(() => useChats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("useCreateChat", () => {
    it("should create chat successfully", async () => {
      chatAPI.createChat.mockResolvedValue({
        success: true,
        data: {
          _id: "new-chat-id",
          participants: [],
        },
      });

      const { result } = renderHook(() => useCreateChat(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync("user-id");
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(chatAPI.createChat).toHaveBeenCalledWith("user-id");
    });

    it("should handle create chat error", async () => {
      chatAPI.createChat.mockRejectedValue(new Error("Failed to create"));

      const { result } = renderHook(() => useCreateChat(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync("user-id");
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});

