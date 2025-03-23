import { apiClient } from "@/app/lib/api/client";
import { login } from "@react-native-kakao/user";
import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "@/app/types/api/auth";
import { QUERY_KEYS } from "@/app/lib/query/keys";

export const useLoginMutation = () => {
  const kakaoLoginMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.KAKAO,
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
    onSuccess: (data) => {
      console.log("로그인 성공:", data);
      console.log("data.accessToken", data.accessToken);
      console.log("data.refreshToken", data.refreshToken);
      console.log("data.userId", data.userId);
    },
  });

  return {
    handleKakaoLogin: kakaoLoginMutation.mutate,
    isLoading: kakaoLoginMutation.isPending,
    error: kakaoLoginMutation.error,
  };
};
