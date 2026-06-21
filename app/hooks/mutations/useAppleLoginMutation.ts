import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import { LoginResponse } from "@/app/types/api/auth";
import { syncCurrentFcmToken } from "@/app/utils/NotificationUtils";
import { useMutation } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";

export const useAppleLoginMutation = () => {
  const appleLoginMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.APPLE(),
    mutationFn: async () => {
      try {
        const { identityToken, authorizationCode } =
          await AppleAuthentication.signInAsync();

        if (identityToken && authorizationCode) {
          if (!identityToken)
            throw new Error("애플 로그인에 실패했습니다. (accessToken 없음)");

          const { data } = await apiClient.post<LoginResponse>(
            "/users/apple-login",
            {
              accessToken: identityToken,
            }
          );
          return data;
        } else if (identityToken) {
          throw new Error("애플 로그인에 실패했습니다.", {
            cause: identityToken,
          });
        } else {
          throw new Error("애플 로그인에 실패했습니다.");
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
    appleLogin: appleLoginMutation.mutateAsync,
    isLoading: appleLoginMutation.isPending,
    error: appleLoginMutation.error,
  };
};
