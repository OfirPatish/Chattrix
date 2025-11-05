import { io } from "socket.io-client";

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

// Track last sent message to prevent duplicates
let lastSentMessage = { chatId: null, content: null, timestamp: 0 };
const DUPLICATE_MESSAGE_WINDOW = 1000; // 1 second window

// Setup message event listeners (only once)
// Declared early to avoid reference errors
export const setupMessageListeners = (socket) => {
  if (messageListenersSetup || !socket) return;

  // Mark as setup immediately to prevent duplicate calls
  messageListenersSetup = true;

  // Use dynamic import to avoid circular dependency
  import("@/store/chatStore").then(({ default: useChatStore }) => {
    // Set up listeners immediately when module loads
    socket.on("receive-message", (message) => {
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

    socket.on("message-read", ({ messageId, userId }) => {
      const { currentChat, messages, updateMessage } = useChatStore.getState();
      if (currentChat?._id) {
        const chatMessages = messages[currentChat._id] || [];
        const message = chatMessages.find((m) => m._id === messageId);
        if (message) {
          updateMessage(currentChat._id, messageId, {
            readBy: [
              ...(message.readBy || []),
              { user: userId, readAt: new Date() },
            ],
          });
        }
      }
    });

    // Listen for user online status updates
    socket.on("user-online", ({ userId, isOnline }) => {
      const { updateUserStatus } = useChatStore.getState();
      if (userId) {
        updateUserStatus(userId, {
          isOnline: isOnline !== undefined ? isOnline : true,
          lastSeen: new Date(),
        });
      }
    });

    socket.on("user-offline", ({ userId, isOnline }) => {
      const { updateUserStatus } = useChatStore.getState();
      if (userId) {
        updateUserStatus(userId, {
          isOnline: isOnline !== undefined ? isOnline : false,
          lastSeen: new Date(),
        });
      }
    });
  });
};

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

      // Set up message listeners when socket connects (if not already set up)
      if (!messageListenersSetup) {
        setupMessageListeners(socketInstance);
      }
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

    // If socket is already connected, set up listeners immediately
    if (socketInstance.connected && !messageListenersSetup) {
      setupMessageListeners(socketInstance);
    }
  }

  return socketInstance;
};

// Get or create socket instance
export const getSocketInstance = (token) => {
  const socket = getSocket(token);
  if (socket && !messageListenersSetup) {
    setupMessageListeners(socket);
  }
  return socket;
};

// Get socket instance (for checking if exists)
export const getSocketInstanceRef = () => socketInstance;

// Get connection state
export const getConnectionState = () => connectionState;

// Send message via socket
export const sendMessage = (
  chatId,
  content,
  messageType = "text",
  imageUrl = ""
) => {
  if (!socketInstance?.connected) {
    console.warn("Socket not connected, cannot send message");
    return;
  }

  // Prevent duplicate sends within 1 second
  const now = Date.now();
  if (
    lastSentMessage.chatId === chatId &&
    lastSentMessage.content === content &&
    now - lastSentMessage.timestamp < DUPLICATE_MESSAGE_WINDOW
  ) {
    console.warn("Duplicate message prevented:", { chatId, content });
    return;
  }

  // Update last sent message
  lastSentMessage = { chatId, content, timestamp: now };

  // Emit message
  socketInstance.emit("send-message", {
    chatId,
    content,
    messageType,
    imageUrl,
  });
};

// Socket action helpers
export const socketActions = {
  startTyping: (chatId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("typing-start", { chatId });
    }
  },

  stopTyping: (chatId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("typing-stop", { chatId });
    }
  },

  markAsRead: (messageId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("mark-read", { messageId });
    }
  },

  joinChat: (chatId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("join-chat", chatId);
    }
  },

  leaveChat: (chatId) => {
    if (socketInstance?.connected) {
      socketInstance.emit("leave-chat", chatId);
    }
  },
};
