import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { CreateRecipeRequest } from "@/app/types/api/recipe";
import { useMutation } from "@tanstack/react-query";

/**
 * 나만의 레시피 생성
 */
export const usePostCreateRecipe = (callbacks: MutationCallbacks) => {
  const postCreateRecipeMutation = useMutation({
    mutationFn: (params: CreateRecipeRequest) =>
      apiClient.post("/recipes", params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE.MY_LIST(),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE.MY_LIST(),
      });

      callbacks.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });

  return {
    postCreateRecipe: postCreateRecipeMutation.mutateAsync,
    isPostCreateRecipePending: postCreateRecipeMutation.isPending,
  };
};
