import { useAutoLoginMutation } from "@/app/hooks/mutations/useAutoLoginMutation";
import { router } from "expo-router";

export const useAutoLogin = () => {
  const { autoLogin } = useAutoLoginMutation();

  const checkAuth = async () => {
    try {
      await autoLogin();
      router.replace("/(tabs)");

      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    checkAuth,
  };
};
