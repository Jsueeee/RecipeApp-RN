import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

/**
 * 냉장고 바구니 재료 삭제
 */
export const useDeleteFridgeBasketIngredientMutation = (
  callbacks?: MutationCallbacks
) => {
  const deleteFridgeBasketIngredientMutation = useMutation({
    mutationKey: QUERY_KEYS.FRIDGE.BASKET(),
    mutationFn: async (id: number) => {
      await apiClient.delete(`/fridges/basket/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FRIDGE.BASKET(),
      });

      // 냉장고 재료 변경 → 레시피 매칭률/추천 결과 갱신
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE.ROOT,
      });

      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });

  return {
    deleteFridgeBasketIngredient:
      deleteFridgeBasketIngredientMutation.mutateAsync,
    isDeletePending: deleteFridgeBasketIngredientMutation.isPending,
  };
};
