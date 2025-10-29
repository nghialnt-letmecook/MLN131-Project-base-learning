import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://n8n.aizy.vn/webhook",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    // Only add token if we're in browser (not SSR)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
import { refreshTokenIfNeeded, getToken } from "@/services/token.api";

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 403 Forbidden - token expired
    if (error.response?.status === 403) {
      await refreshTokenIfNeeded(true);
      const originalRequest = error.config;
      const newToken = getToken();
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        return Promise.reject({ message: "Unable to refresh token" });
      }
    }
    // Handle 401 Unauthorized - no token or invalid token
    if (error.response?.status === 401) {
      await refreshTokenIfNeeded(true);
      const originalRequest = error.config;
      const newToken = getToken();
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        return Promise.reject({ message: "Unable to refresh token" });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
