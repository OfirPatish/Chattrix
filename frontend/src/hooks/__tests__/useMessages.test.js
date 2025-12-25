import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMessages, useInfiniteMessages } from "../useMessages";
import { messageAPI } from "@/lib/api";

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

describe("useMessages hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useMessages", () => {
    it("should fetch messages successfully", async () => {
      messageAPI.getMessages.mockResolvedValue({
        success: true,
        data: [
          {
            _id: "msg1",
            content: "Hello",
            chat: "chat1",
          },
        ],
        page: 1,
        pages: 1,
      });

      const { result } = renderHook(() => useMessages("chat1", 1, 50), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data.messages).toHaveLength(1);
      expect(messageAPI.getMessages).toHaveBeenCalledWith("chat1", 1, 50);
    });

    it("should not fetch if chatId is not provided", () => {
      const { result } = renderHook(() => useMessages(null, 1, 50), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
    });
  });

  describe("useInfiniteMessages", () => {
    it("should fetch messages with infinite scroll", async () => {
      messageAPI.getMessages.mockResolvedValue({
        success: true,
        data: [
          {
            _id: "msg1",
            content: "Hello",
            chat: "chat1",
          },
        ],
        page: 1,
        pages: 2,
      });

      const { result } = renderHook(() => useInfiniteMessages("chat1", 50), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data.pages[0].messages).toHaveLength(1);
      expect(result.current.hasNextPage).toBe(true);
    });

    it("should determine next page correctly", async () => {
      messageAPI.getMessages.mockResolvedValue({
        success: true,
        data: [],
        page: 1,
        pages: 1,
      });

      const { result } = renderHook(() => useInfiniteMessages("chat1", 50), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(false);
    });
  });
});

