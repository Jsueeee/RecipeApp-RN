import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
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
    onSuccess: (_, { recipeId }) => {
      // 수정된 레시피가 영향을 주는 모든 캐시 무효화
      // (상세, 내 레시피 목록, 추천 목록, 검색 결과 등)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE.DETAIL(recipeId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECIPE.ROOT });

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
