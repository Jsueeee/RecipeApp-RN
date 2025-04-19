import { apiClient } from "@/app/lib/api/client";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

export const useDeleteMyRecipeMutation = (callbacks?: MutationCallbacks) => {
  const deleteMutation = useMutation({
    mutationFn: (recipeId: number) => apiClient.delete(`/recipes/${recipeId}`),
    onSuccess: () => {
      callbacks?.onSuccess?.();
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
