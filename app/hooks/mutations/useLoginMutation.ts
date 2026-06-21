import { apiClient } from "@/app/lib/api/client";
import { login } from "@react-native-kakao/user";
import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "@/app/types/api/auth";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import {
  getFcmToken,
  syncCurrentFcmToken,
} from "@/app/utils/NotificationUtils";

export const useLoginMutation = () => {
  const kakaoLoginMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.KAKAO(),
    mutationFn: async () => {
      const result = await login();
      const fcmToken = await getFcmToken();

      const { data } = await apiClient.post<LoginResponse>(
        "/users/kakao-login",
        {
          accessToken: result.accessToken,
          fcmToken,
        }
      );
      return data;
    },
    onSuccess: async (data) => {
      await authStorage.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
      });

      void syncCurrentFcmToken();
    },
  });

  return {
    kakaoLogin: kakaoLoginMutation.mutateAsync,
    isLoading: kakaoLoginMutation.isPending,
    error: kakaoLoginMutation.error,
  };
};
