import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

interface RequestPostIngredients {
  ingredientIconId: number;
  ingredientName: string;
  ingredientCategoryId: number;
}

export const usePostMyIngredientMutation = (callbacks?: MutationCallbacks) => {
  const postMyIngredientMutation = useMutation({
    mutationFn: (data: RequestPostIngredients) =>
      apiClient.post("/ingredients", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INGREDIENT.MY(),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INGREDIENT.PICK_LIST(),
      });

      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });

  return {
    postMyIngredient: postMyIngredientMutation.mutateAsync,
    isPending: postMyIngredientMutation.isPending,
  };
};
