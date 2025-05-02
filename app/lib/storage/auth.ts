import * as SecureStore from "expo-secure-store";

export const AUTH_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER_ID: "auth_user_id",
} as const;

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
  },
  getAccessToken: async () => {
    return await SecureStore.getItemAsync(AUTH_KEYS.ACCESS_TOKEN);
  },
  clear: async () => {
    await SecureStore.deleteItemAsync(AUTH_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(AUTH_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(AUTH_KEYS.USER_ID);
  },
};
