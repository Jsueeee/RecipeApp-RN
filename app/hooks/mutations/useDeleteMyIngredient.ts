import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

export const useDeleteMyIngredient = (callbacks?: MutationCallbacks) => {
  const mutation = useMutation({
    mutationFn: (ingredientId: number) =>
      apiClient.delete(`/ingredients/${ingredientId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INGREDIENT.MY] });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });

  return {
    deleteIngredient: mutation.mutate,
    isDeleteLoading: mutation.isPending,
  };
};
