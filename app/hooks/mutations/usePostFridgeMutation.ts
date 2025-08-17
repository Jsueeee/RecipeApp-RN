import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

export const usePostFridgeMutation = (callbacks?: MutationCallbacks) => {
  const postFridgeMutation = useMutation({
    mutationKey: QUERY_KEYS.FRIDGE.FRIDGES(),
    mutationFn: () => apiClient.post("/fridges"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FRIDGE.FRIDGES(),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FRIDGE.BASKET(),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE.RECOMMENDED_LIST(),
      });

      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });

  return {
    postFridge: postFridgeMutation.mutateAsync,
    isPending: postFridgeMutation.isPending,
  };
};
