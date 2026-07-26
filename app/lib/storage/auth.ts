import * as SecureStore from "expo-secure-store";

export const AUTH_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER_ID: "auth_user_id",
} as const;

type AuthStorageListener = () => void;

const authStorageListeners = new Set<AuthStorageListener>();

const notifyAuthStorageChanged = () => {
  authStorageListeners.forEach((listener) => listener());
};

export const authStorage = {
  setTokens: async (tokens: {
    accessToken: string;
    refreshToken: string;
    userId: number;
  }) => {
    await SecureStore.setItemAsync(AUTH_KEYS.ACCESS_TOKEN, tokens.accessToken);
    await SecureStore.setItemAsync(
      AUTH_KEYS.REFRESH_TOKEN,
      tokens.refreshToken
    );
    await SecureStore.setItemAsync(AUTH_KEYS.USER_ID, String(tokens.userId));
    notifyAuthStorageChanged();
  },
  getAccessToken: async () =>
    await SecureStore.getItemAsync(AUTH_KEYS.ACCESS_TOKEN),
  getRefreshToken: async () =>
    await SecureStore.getItemAsync(AUTH_KEYS.REFRESH_TOKEN),
  getUserId: async () => await SecureStore.getItemAsync(AUTH_KEYS.USER_ID),
  clear: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(AUTH_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(AUTH_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(AUTH_KEYS.USER_ID),
    ]);
    notifyAuthStorageChanged();
  },
  subscribe: (listener: AuthStorageListener) => {
    authStorageListeners.add(listener);
    return () => {
      authStorageListeners.delete(listener);
    };
  },
};
