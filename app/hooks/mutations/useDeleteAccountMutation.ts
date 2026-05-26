import { apiClient, setAuthRedirectSuppressed } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import { RequestDeleteAccount } from "@/app/types/api/user";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteAccountMutation = (callbacks?: MutationCallbacks) => {
  const queryClient = useQueryClient();

  const deleteAccountMutation = useMutation({
    mutationKey: QUERY_KEYS.USER.DELETE_ACCOUNT(),
    mutationFn: async (params: RequestDeleteAccount) => {
      const response = await apiClient.delete(`/users`, {
        data: params,
      });

      return response.data;
    },
    onSuccess: async () => {
      setAuthRedirectSuppressed(true);
      await authStorage.clear();
      queryClient.clear();
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      callbacks?.onError?.(error);
    },
  });

  return {
    deleteAccount: deleteAccountMutation.mutateAsync,
    isLoading: deleteAccountMutation.isPending,
  };
};
