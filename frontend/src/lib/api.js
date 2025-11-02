import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect on auth endpoints (login/register) - let them handle errors
      const isAuthEndpoint =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/register");

      if (!isAuthEndpoint) {
        // Only redirect to login for protected endpoints, not auth endpoints
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// User API
export const userAPI = {
  getUsers: async (search = "") => {
    const response = await api.get("/users", {
      params: { search },
    });
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  getChats: async () => {
    const response = await api.get("/chats");
    return response.data;
  },
  createChat: async (userId) => {
    const response = await api.post("/chats", { userId });
    return response.data;
  },
  getChatById: async (chatId) => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  },
};

// Message API
export const messageAPI = {
  getMessages: async (chatId, page = 1, limit = 50) => {
    const response = await api.get(`/messages/${chatId}`, {
      params: { page, limit },
    });
    return response.data;
  },
  createMessage: async (data) => {
    const response = await api.post("/messages", data);
    return response.data;
  },
  markAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },
};

export default api;
