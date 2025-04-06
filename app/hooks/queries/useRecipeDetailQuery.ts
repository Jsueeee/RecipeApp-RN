import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { RecipeDetailResponse } from "@/app/types/api/recipe";
import { mapRecipeDetailResponse } from "@/app/types/mappers/recipe";
import { useQuery } from "@tanstack/react-query";

/**
 * 레시피 상세 조회
 */
export const useRecipeDetailQuery = (recipeId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RECIPE.DETAIL, recipeId],
    queryFn: async () => {
      const response = await apiClient.get<RecipeDetailResponse>(
        `/recipes/${recipeId}`
      );
      return response.data;
    },
    select: mapRecipeDetailResponse,
  });
};
