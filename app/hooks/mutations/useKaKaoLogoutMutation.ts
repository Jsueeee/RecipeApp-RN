import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import { clearSyncedFcmToken } from "@/app/utils/NotificationUtils";
import { logout as logoutKakao } from "@react-native-kakao/user";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export const useKaKaoLogoutMutation = () => {
  const kakaoLogoutMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.KAKAO(),
    mutationFn: async () => {
      try {
        await logoutKakao();
      } catch (error) {
        console.warn("Logout API failed", error);
      }

      await clearSyncedFcmToken();
      await authStorage.clear();
      queryClient.clear();
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
