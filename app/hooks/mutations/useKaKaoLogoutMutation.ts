import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { logout as logoutKakao } from "@react-native-kakao/user";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export const useKaKaoLogoutMutation = (callbacks?: MutationCallbacks) => {
  const kakaoLogoutMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.KAKAO(),
    mutationFn: async () => {
      try {
        await logoutKakao();
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
    kakaoLogout: kakaoLogoutMutation.mutateAsync,
    isLoading: kakaoLogoutMutation.isPending,
    error: kakaoLogoutMutation.error,
  };
};
