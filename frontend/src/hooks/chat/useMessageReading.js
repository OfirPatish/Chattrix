import { useEffect, useRef } from "react";
import { useSocket } from "@/hooks/useSocket";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";

/**
 * Hook to handle marking messages as read when viewing a chat
 */
export function useMessageReading(currentChat) {
  const { messages } = useChatStore();
  const { markAsRead } = useSocket();
  const { user } = useAuthStore();
  const processedMessageIdsRef = useRef(new Set());
  const previousChatIdRef = useRef(null);

  useEffect(() => {
    const chatId = currentChat?._id;
    if (!chatId) {
      processedMessageIdsRef.current.clear();
      return;
    }

    const chatMessages = messages[chatId];
    if (!chatMessages?.length) {
      return;
    }

    // Reset processed messages when switching chats
    if (previousChatIdRef.current !== chatId) {
      previousChatIdRef.current = chatId;
      processedMessageIdsRef.current.clear();
    }

    const userId = user?._id;
    const unreadMessages = chatMessages.filter(
      (msg) =>
        msg._id &&
        msg.sender?._id !== userId &&
        msg.sender !== userId &&
        !msg.readBy?.some((r) => (r.user?._id || r.user) === userId) &&
        !processedMessageIdsRef.current.has(msg._id)
    );

    // Mark new unread messages and track them
    unreadMessages.forEach((msg) => {
      markAsRead(msg._id);
      processedMessageIdsRef.current.add(msg._id);
    });
  }, [currentChat?._id, user?._id, markAsRead, messages]);
}
