import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api/client";
import type { AutoLoginResponse } from "@/app/types/api/auth";
import { QUERY_KEYS } from "@/app/lib/query/keys";

export const useAutoLoginMutation = () => {
  const autoLoginMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.AUTO_LOGIN(),
    mutationFn: async () => {
      const { data } = await apiClient.post<AutoLoginResponse>(
        "/users/auto-login"
      );
      return data;
    },
  });

  return {
    autoLogin: autoLoginMutation.mutateAsync,
    error: autoLoginMutation.error,
  };
};
