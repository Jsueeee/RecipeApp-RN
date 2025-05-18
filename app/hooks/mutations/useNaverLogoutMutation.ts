import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import { MutationCallbacks } from "@/app/types/common/mutation";
import NaverLogin from "@react-native-seoul/naver-login";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export const useNaverLogoutMutation = (callbacks?: MutationCallbacks) => {
  const naverLogoutMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.NAVER,
    mutationFn: async () => {
      try {
        await NaverLogin.logout();
      } catch (error) {
        console.warn("Logout API failed", error);
      }

      await authStorage.clear();
    },
    onSuccess: () => {
      router.dismissAll();
      router.replace("/(auth)");
    },
  });

  return {
    naverLogout: naverLogoutMutation.mutateAsync,
    isLoading: naverLogoutMutation.isPending,
    error: naverLogoutMutation.error,
  };
};
