import { apiClient } from "@/app/lib/api/client";
import { PatchRecipeRequest } from "@/app/types/api/recipe";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

export const usePatchRecipeMutation = (callbacks: MutationCallbacks) => {
  const patchRecipeMutation = useMutation({
    mutationFn: ({
      recipeId,
      params,
    }: {
      recipeId: number;
      params: PatchRecipeRequest;
    }) => apiClient.patch(`/recipes/${recipeId}`, params),
    onSuccess: () => {
      callbacks.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });

  return {
    patchRecipe: patchRecipeMutation.mutateAsync,
    isPatchRecipePending: patchRecipeMutation.isPending,
  };
};
