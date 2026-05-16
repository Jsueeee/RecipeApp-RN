import { useAutoLoginMutation } from "@/app/hooks/mutations/useAutoLoginMutation";
import { authStorage } from "@/app/lib/storage/auth";

export const useAutoLogin = () => {
  const { autoLogin } = useAutoLoginMutation();

  const checkAuth: () => Promise<boolean> = async () => {
    try {
      const [accessToken, refreshToken, userId] = await Promise.all([
        authStorage.getAccessToken(),
        authStorage.getRefreshToken(),
        authStorage.getUserId(),
      ]);
      const hasRefreshCredentials = Boolean(refreshToken && userId);

      if (!accessToken && !hasRefreshCredentials) {
        return false;
      }

      if (accessToken && !hasRefreshCredentials) {
        await authStorage.clear();
        return false;
      }

      await autoLogin();

      return true;
    } catch (error) {
      console.error("🚫 Auto login failed:", error);

      return false;
    }
  };

  return {
    checkAuth,
  };
};
