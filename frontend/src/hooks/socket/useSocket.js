import { useEffect, useState, useCallback } from "react";
import useAuthStore from "@/store/authStore";
import {
  getSocketInstance,
  getConnectionState,
  getSocketInstanceRef,
  sendMessage as sendMessageAction,
  socketActions,
  disconnectSocket,
} from "./socketManager";

// React hook for socket connection and actions
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(
    getConnectionState().isConnected
  );
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    if (!accessToken || !user) {
      // If no token/user, disconnect socket
      if (getSocketInstanceRef()) {
        disconnectSocket();
      }
      return;
    }

    // Get or create socket instance
    const socket = getSocketInstance(accessToken);
    if (!socket) {
      return;
    }

    // Register this component's connection state listener
    const connectionState = getConnectionState();
    connectionState.listeners.add(setIsConnected);

    // Update state asynchronously to avoid linter warning
    if (socket.connected !== connectionState.isConnected) {
      setTimeout(() => setIsConnected(socket.connected), 0);
    }

    // Cleanup: Remove connection state listener
    return () => {
      connectionState.listeners.delete(setIsConnected);
    };
  }, [accessToken, user]);

  // Memoize sendMessage to prevent recreation
  const sendMessage = useCallback(
    (chatId, content, messageType = "text", imageUrl = "") => {
      sendMessageAction(chatId, content, messageType, imageUrl);
    },
    []
  );

  return {
    sendMessage,
    startTyping: socketActions.startTyping,
    stopTyping: socketActions.stopTyping,
    markAsRead: socketActions.markAsRead,
    joinChat: socketActions.joinChat,
    leaveChat: socketActions.leaveChat,
    isConnected,
  };
};
