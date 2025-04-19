import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { RequestUpdateUserInfo } from "@/app/types/api/mypage";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUserMutation = (callbacks?: MutationCallbacks) => {
  const queryClient = useQueryClient();

  const updateUserInfoMutation = useMutation({
    mutationKey: QUERY_KEYS.USER.INFO,
    mutationFn: async (params: RequestUpdateUserInfo) => {
      await apiClient.patch("/users", params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER.INFO,
      });
      callbacks?.onSuccess?.();
    },
  });

  return {
    updateUserInfo: updateUserInfoMutation.mutateAsync,
    isPending: updateUserInfoMutation.isPending,
  };
};
