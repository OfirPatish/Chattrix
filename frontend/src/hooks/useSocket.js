import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "@/store/authStore";
import useChatStore from "@/store/chatStore";

// Use single BACKEND_URL or fallback to SOCKET_URL for backward compatibility
const SOCKET_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  "http://localhost:3000";

// Singleton socket instance
let socketInstance = null;
let connectionState = { isConnected: false, listeners: new Set() };
let connectionListenersSetup = false;
let messageListenersSetup = false;
let currentToken = null;

// Cleanup and disconnect socket
export const disconnectSocket = () => {
  if (socketInstance) {
    console.log("🔌 Disconnecting socket...");
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
    connectionState.isConnected = false;
    connectionState.listeners.forEach((setConnected) => setConnected(false));
    connectionListenersSetup = false;
    messageListenersSetup = false;
    currentToken = null;
  }
};

const getSocket = (token) => {
  if (!token) {
    // If no token, disconnect existing socket
    if (socketInstance) {
      disconnectSocket();
    }
    return null;
  }

  // If token changed, disconnect old socket and create new one
  if (currentToken && currentToken !== token && socketInstance) {
    console.log("🔄 Token changed, reconnecting socket...");
    disconnectSocket();
  }

  // If socket exists and is connected with same token, reuse it
  if (socketInstance?.connected && currentToken === token) {
    return socketInstance;
  }

  // If socket exists but disconnected, reconnect
  if (socketInstance && !socketInstance.connected && currentToken === token) {
    socketInstance.connect();
    return socketInstance;
  }

  // Create new socket instance
  currentToken = token;
  socketInstance = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // Set up global connection listeners (only once per socket instance)
  if (!connectionListenersSetup) {
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected");
      connectionState.isConnected = true;
      connectionState.listeners.forEach((setConnected) => setConnected(true));
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      connectionState.isConnected = false;
      connectionState.listeners.forEach((setConnected) => setConnected(false));
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      connectionState.isConnected = false;
      connectionState.listeners.forEach((setConnected) => setConnected(false));
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    connectionListenersSetup = true;
  }

  return socketInstance;
};

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(connectionState.isConnected);
  const { token, user } = useAuthStore();
  const { addMessage, updateChat, updateMessage } = useChatStore();

  useEffect(() => {
    if (!token || !user) {
      // If no token/user, disconnect socket
      if (socketInstance) {
        disconnectSocket();
      }
      return;
    }

    // Get or create socket instance
    const socket = getSocket(token);
    if (!socket) {
      return;
    }

    // Register this component's connection state listener
    connectionState.listeners.add(setIsConnected);

    // Update state asynchronously to avoid linter warning
    if (socket.connected !== connectionState.isConnected) {
      setTimeout(() => setIsConnected(socket.connected), 0);
    }

    // Register message event listeners globally (only once)
    if (!messageListenersSetup && socketInstance) {
      socketInstance.on("receive-message", (message) => {
        const { addMessage, updateChat } = useChatStore.getState();
        // Handle both ObjectId string and populated chat object
        const chatId =
          typeof message.chat === "string"
            ? message.chat
            : message.chat?._id || message.chat;
        if (chatId) {
          addMessage(chatId, message);
          updateChat(chatId, { lastMessage: message });
        }
      });

      socketInstance.on("message-read", ({ messageId, userId }) => {
        const { currentChat, updateMessage } = useChatStore.getState();
        if (currentChat?._id) {
          updateMessage(currentChat._id, messageId, {
            readBy: [
              ...(currentChat.messages?.find((m) => m._id === messageId)
                ?.readBy || []),
              { user: userId, readAt: new Date() },
            ],
          });
        }
      });

      messageListenersSetup = true;
    }

    // Cleanup: Remove connection state listener
    return () => {
      connectionState.listeners.delete(setIsConnected);
    };
  }, [token, user]);

  // Send message via socket
  const sendMessage = (
    chatId,
    content,
    messageType = "text",
    imageUrl = ""
  ) => {
    if (socketInstance?.connected) {
      socketInstance.emit("send-message", {
        chatId,
        content,
        messageType,
        imageUrl,
      });
    }
  };

  // Typing indicators
  const startTyping = (chatId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("typing-start", { chatId });
    }
  };

  const stopTyping = (chatId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("typing-stop", { chatId });
    }
  };

  // Mark message as read
  const markAsRead = (messageId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("mark-read", { messageId });
    }
  };

  // Join chat room
  const joinChat = (chatId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("join-chat", chatId);
    }
  };

  // Leave chat room
  const leaveChat = (chatId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("leave-chat", chatId);
    }
  };

  return {
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    joinChat,
    leaveChat,
    isConnected,
  };
};
