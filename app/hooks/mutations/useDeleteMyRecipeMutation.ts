import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

export const useDeleteMyRecipeMutation = (callbacks?: MutationCallbacks) => {
  const deleteMutation = useMutation({
    mutationFn: (recipeId: number) => apiClient.delete(`/recipes/${recipeId}`),
    onSuccess: () => {
      callbacks?.onSuccess?.();

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER.INFO(),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE.MY_LIST(),
      });
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });

  return {
    deleteMyRecipe: deleteMutation.mutate,
    isLoading: deleteMutation.isPending,
  };
};
