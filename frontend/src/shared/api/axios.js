import axios from "axios";

/**
 * Preconfigured axios instance for API requests
 * Includes credentials with all requests for authentication
 */
export const axiosInstance = axios.create({
  // Development base URL
  baseURL: "http://localhost:3000/api",
  // Include cookies in cross-origin requests
  withCredentials: true,
});

/**
 * Response interceptor for global error handling
 * Specifically manages 401 unauthorized errors silently (without toast notifications)
 * to prevent flooding users with auth error messages during token expiration
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Mark authentication errors as silent to avoid duplicate error toasts
    if (error.response && error.response.status === 401) {
      return Promise.reject({ ...error, silent: true });
    }
    return Promise.reject(error);
  }
);
