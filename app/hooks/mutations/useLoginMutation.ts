import { apiClient } from "@/app/lib/api/client";
import { login } from "@react-native-kakao/user";
import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "@/app/types/api/auth";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";

export const useLoginMutation = () => {
  const kakaoLoginMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.KAKAO(),
    mutationFn: async () => {
      const result = await login();

      const { data } = await apiClient.post<LoginResponse>(
        "/users/kakao-login",
        {
          accessToken: result.accessToken,
          fcmToken: "", // TODO : get fcm token
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
    },
  });

  return {
    kakaoLogin: kakaoLoginMutation.mutateAsync,
    isLoading: kakaoLoginMutation.isPending,
    error: kakaoLoginMutation.error,
  };
};
