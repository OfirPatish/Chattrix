import { useEffect, useRef } from "react";
import useChatStore from "@/store/chatStore";
import { useSocket } from "@/hooks/useSocket";

/**
 * Hook to handle chat switching logic (fetching, joining/leaving rooms, scrolling)
 */
export function useChatSwitching(currentChat) {
  const { chats, messages, fetchChatById, fetchMessages } = useChatStore();
  const { joinChat, leaveChat } = useSocket();
  const previousChatIdRef = useRef(null);
  const scrollStateRef = useRef({
    scrollHeight: 0,
    lastMessageCount: 0,
    isInitialLoad: false,
    justLoadedOlder: false,
    firstMessageId: null,
  });

  useEffect(() => {
    const chatId = currentChat?._id;
    if (!chatId || chatId === previousChatIdRef.current) {
      if (!chatId) previousChatIdRef.current = null;
      return;
    }

    const previousChatId = previousChatIdRef.current;
    previousChatIdRef.current = chatId;
    scrollStateRef.current.lastMessageCount = 0;
    scrollStateRef.current.firstMessageId = null;

    // Leave previous chat room if switching
    if (previousChatId && previousChatId !== chatId) {
      leaveChat(previousChatId);
    }

    // Only fetch chat details if chat is completely missing from the list
    const existingChat = chats.find((c) => c._id === chatId);
    if (!existingChat) {
      fetchChatById(chatId);
    }

    joinChat(chatId);

    const existingMessages = messages[chatId];
    if (existingMessages?.length > 0) {
      // Messages exist, scroll to bottom after render
      scrollStateRef.current.isInitialLoad = true;
      requestAnimationFrame(() => {
        scrollStateRef.current.isInitialLoad = false;
      });
    } else {
      // Fetch messages
      scrollStateRef.current.isInitialLoad = true;
      fetchMessages(chatId, true);
    }
  }, [
    currentChat?._id,
    chats,
    messages,
    fetchChatById,
    fetchMessages,
    joinChat,
    leaveChat,
  ]);

  return { scrollStateRef };
}
