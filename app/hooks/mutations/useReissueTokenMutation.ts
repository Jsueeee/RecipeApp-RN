import { apiClient } from "@/app/lib/api/client";
import { authStorage } from "@/app/lib/storage/auth";
import {
  ReissueTokenRequest,
  ReissueTokenResponse,
} from "@/app/types/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useReissueTokenMutation = () => {
  const { mutateAsync, error } = useMutation({
    mutationFn: async () => {
      const refreshToken = await authStorage.getRefreshToken();
      if (!refreshToken) throw new Error("Refresh token not found");

      const userId = await authStorage.getUserId();
      if (!userId) throw new Error("User ID not found");

      const body: ReissueTokenRequest = {
        userId: Number(userId),
        refreshToken,
      };

      const { data } = await apiClient.post<ReissueTokenResponse>(
        "/users/token-reissue",
        body
      );

      return data;
    },
  });

  return {
    reissueToken: mutateAsync,
    error,
  };
};
