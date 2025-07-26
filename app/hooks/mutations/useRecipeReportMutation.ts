import { apiClient } from "@/app/lib/api/client";
import { MutationCallbacks } from "@/app/types/common/mutation";
import { useMutation } from "@tanstack/react-query";

/**
 * 레시피 신고하기
 */
export const useRecipeReportMutation = ({
  onSuccess,
  onError,
}: MutationCallbacks) => {
  const { mutateAsync } = useMutation({
    mutationFn: async (recipeId: number) =>
      apiClient.post(`/recipes/${recipeId}/reports`),
    onSuccess,
    onError,
  });

  return {
    reportRecipe: mutateAsync,
  };
};
