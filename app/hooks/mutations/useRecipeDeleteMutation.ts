import { apiClient } from "@/app/lib/api/client";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

/**
 * 레시피 삭제하기
 */
export const useRecipeDeleteMutation = ({
  onSuccess,
  onError,
}: MutationCallbacks) => {
  const { mutateAsync } = useMutation({
    mutationFn: async (recipeId: number) =>
      apiClient.delete(`/recipes/${recipeId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER.ROOT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE.ROOT,
      });

      onSuccess?.();
    },
    onError,
  });

  return {
    deleteRecipe: mutateAsync,
  };
};
