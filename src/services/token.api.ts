import api from "@/lib/api";

// Token management constants
const TOKEN_KEY = "auth_token";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";

// Interface for token response
interface TokenResponse {
  token: string;
  expiresIn?: number; // Optional expiry time in seconds
}

// Create/Login to get token
export const createToken = async () => {
  try {
    const response = await api.post("/login");

    const tokenData: TokenResponse = response.data;

    // Store token in localStorage
    if (tokenData.token) {
      localStorage.setItem(TOKEN_KEY, tokenData.token);

      // Calculate and store expiry time if provided
      if (tokenData.expiresIn) {
        const expiryTime = Date.now() + tokenData.expiresIn * 1000;
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      }
    }

    return tokenData;
  } catch (error: any) {
    throw error;
  }
};

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null; // SSR check

  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  // Check if token is expired
  if (token && expiry) {
    const expiryTime = parseInt(expiry);
    if (Date.now() > expiryTime) {
      removeToken();
      return null;
    }
  }

  return token;
};

// Remove token from localStorage
export const removeToken = (): void => {
  if (typeof window === "undefined") return; // SSR check

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

// Check if user has valid token
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Auto-refresh token if needed
export const refreshTokenIfNeeded = async (
  forceRefresh = false
): Promise<void> => {
  const token = getToken();

  if (!token || forceRefresh) {
    if (forceRefresh) {
      await createToken();
    }
  }
};
