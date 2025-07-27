import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import { LoginResponse } from "@/app/types/api/auth";
import {
  GoogleSignin,
  isCancelledResponse,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";

export const useGoogleLoginMutation = () => {
  const googleLoginMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.GOOGLE(),
    mutationFn: async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();

        if (isSuccessResponse(response)) {
          const { idToken } = response.data;
          if (!idToken)
            throw new Error("구글 로그인에 실패했습니다. (idToken 없음)");

          const { data } = await apiClient.post<LoginResponse>(
            "/users/google-login",
            {
              accessToken: idToken,
              fcmToken: "", // TODO: FCM 토큰 필요시 추가
            }
          );
          return data;
        } else if (isCancelledResponse(response)) {
          throw new Error("사용자가 로그인을 취소했습니다.");
        } else {
          throw new Error("구글 로그인에 실패했습니다.");
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
    },
  });

  return {
    googleLogin: googleLoginMutation.mutateAsync,
    isLoading: googleLoginMutation.isPending,
    error: googleLoginMutation.error,
  };
};
