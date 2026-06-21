import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import { LoginResponse } from "@/app/types/api/auth";
import {
  getFcmToken,
  syncCurrentFcmToken,
} from "@/app/utils/NotificationUtils";
import NaverLogin from "@react-native-seoul/naver-login";
import { useMutation } from "@tanstack/react-query";

export const useNaverLoginMutation = () => {
  const naverLoginMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.NAVER(),
    mutationFn: async () => {
      try {
        const { failureResponse, successResponse } = await NaverLogin.login();

        if (successResponse) {
          const { accessToken } = successResponse;
          if (!accessToken)
            throw new Error("네이버 로그인에 실패했습니다. (accessToken 없음)");

          const fcmToken = await getFcmToken();

          const { data } = await apiClient.post<LoginResponse>(
            "/users/naver-login",
            {
              accessToken,
              fcmToken,
            }
          );
          return data;
        } else if (failureResponse) {
          throw new Error("네이버 로그인에 실패했습니다.", {
            cause: failureResponse,
          });
        } else {
          throw new Error("네이버 로그인에 실패했습니다.");
        }
      } catch (error: any) {
        throw error;
      }
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
    naverLogin: naverLoginMutation.mutateAsync,
    isLoading: naverLoginMutation.isPending,
    error: naverLoginMutation.error,
  };
};
