import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

interface RequestPostFridgeBasket {
  ingredientIds: number[];
}

/**
 * 냉장고 바구니 추가
 */
export const usePostFridgeBasketMutation = (callbacks?: MutationCallbacks) => {
  const postFridgeBasketMutation = useMutation({
    mutationKey: QUERY_KEYS.FRIDGE.BASKET,
    mutationFn: async (params: RequestPostFridgeBasket) => {
      await apiClient.post("/fridges/basket", params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FRIDGE.BASKET,
      });

      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });

  return {
    postFridgeBasket: postFridgeBasketMutation.mutateAsync,
    isPostBasketPending: postFridgeBasketMutation.isPending,
  };
};
