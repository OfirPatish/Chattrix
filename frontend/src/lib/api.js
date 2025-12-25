import axios from "axios";
import useAuthStore from "@/store/authStore";

// Use single BACKEND_URL or fallback to API_URL for backward compatibility
const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    // Remove trailing /api if present
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
  }
  return "http://localhost:3000";
};

const BACKEND_URL = getBackendUrl().replace(/\/$/, ""); // Remove trailing slash
const API_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if refresh is in progress to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add accessToken to requests if available
api.interceptors.request.use((config) => {
  // Get accessToken from Zustand store (which persists to localStorage)
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle response errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh/logout/auth endpoints
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/logout");

    // Handle 401 errors (expired access token)
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        // No refresh token available, logout
        isRefreshing = false;
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the access token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        if (response.data.success && response.data.data) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Update tokens in store
          useAuthStore.getState().setAccessToken(newAccessToken);
          if (newRefreshToken) {
            useAuthStore.getState().setRefreshToken(newRefreshToken);
          }

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Process queued requests
          processQueue(null, newAccessToken);

          isRefreshing = false;

          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error("Refresh token response invalid");
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For other errors or auth endpoints, handle normally
    if (error.response?.status === 401 && isAuthEndpoint) {
      // Let auth endpoints handle their own errors
      return Promise.reject(error);
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
  refreshToken: async (refreshToken) => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },
  logout: async (refreshToken) => {
    const response = await api.post("/auth/logout", { refreshToken });
    return response.data;
  },
};

// User API
export const userAPI = {
  getUsers: async (search = "", page = 1, limit = 20) => {
    const response = await api.get("/users", {
      params: { search, page, limit },
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
