import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { messageAPI } from "@/lib/api";
import { extractErrorMessage } from "@/utils/errorUtils";

// Get messages for a chat with pagination
export function useMessages(chatId, page = 1, limit = 50) {
  return useQuery({
    queryKey: ["messages", chatId, page],
    queryFn: async () => {
      if (!chatId) return null;
      const response = await messageAPI.getMessages(chatId, page, limit);
      if (response && response.success) {
        return {
          messages: response.data,
          page: response.page || page,
          pages: response.pages || 1,
          hasMore: (response.page || page) < (response.pages || 1),
        };
      }
      throw new Error(
        response?.message || response?.error || "Failed to fetch messages"
      );
    },
    enabled: !!chatId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Infinite scroll messages query
export function useInfiniteMessages(chatId, limit = 50) {
  return useInfiniteQuery({
    queryKey: ["messages", chatId, "infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      if (!chatId) return null;
      const response = await messageAPI.getMessages(chatId, pageParam, limit);
      if (response && response.success) {
        return {
          messages: response.data,
          page: response.page || pageParam,
          pages: response.pages || 1,
          hasMore: (response.page || pageParam) < (response.pages || 1),
        };
      }
      throw new Error(
        response?.message || response?.error || "Failed to fetch messages"
      );
    },
    enabled: !!chatId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasMore) return undefined;
      return lastPage.page + 1;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
