import { useAutoLoginMutation } from "@/app/hooks/mutations/useAutoLoginMutation";
import { router } from "expo-router";

export const useAutoLogin = () => {
  const { autoLogin } = useAutoLoginMutation();

  const checkAuth: () => Promise<boolean> = async () => {
    try {
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
