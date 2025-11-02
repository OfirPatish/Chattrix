import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatAPI } from "@/lib/api";
import useChatStore from "@/store/chatStore";

// Get all chats query
export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await chatAPI.getChats();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch chats");
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Create chat mutation
export function useCreateChat() {
  const queryClient = useQueryClient();
  const { addChat, setCurrentChat } = useChatStore.getState();

  return useMutation({
    mutationFn: async (userId) => {
      const response = await chatAPI.createChat(userId);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || "Failed to create chat");
    },
    onSuccess: (newChat) => {
      // Update Zustand store
      addChat(newChat);
      setCurrentChat(newChat);

      // Invalidate and refetch chats list
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

// Get chat by ID query
export function useChatById(chatId) {
  return useQuery({
    queryKey: ["chats", chatId],
    queryFn: async () => {
      if (!chatId) return null;
      const response = await chatAPI.getChatById(chatId);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch chat");
    },
    enabled: !!chatId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
