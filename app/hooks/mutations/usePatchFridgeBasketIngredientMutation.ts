import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

interface RequestPatchFridgeBasketIngredient {
  expiredAt?: string;
  quantity: number;
  unit?: string;
}

/**
 * 냉장고 바구니 재료 수정
 */
export const usePatchFridgeBasketIngredientMutation = (
  callbacks?: MutationCallbacks
) => {
  const patchFridgeBasketIngredientMutation = useMutation({
    mutationKey: QUERY_KEYS.FRIDGE.BASKET(),
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: RequestPatchFridgeBasketIngredient;
    }) => {
      await apiClient.patch(`/fridges/basket/${id}`, body);
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
    patchFridgeBasketIngredient:
      patchFridgeBasketIngredientMutation.mutateAsync,
    isPatchPending: patchFridgeBasketIngredientMutation.isPending,
  };
};
