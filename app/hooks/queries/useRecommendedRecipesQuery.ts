import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { RecommendedRecipesResponse } from "@/app/types/api/recipe";
import { RecipeSummaryList, RecipeSummary } from "@/app/types/domain/recipe";
import { mapRecommendedRecipesResponse } from "@/app/types/mappers/recipe";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

export const useRecommendedRecipesQuery = () => {
  return useInfiniteQuery<
    RecommendedRecipesResponse,
    Error,
    RecipeSummaryList,
    typeof QUERY_KEYS.RECIPE.RECOMMENDED_LIST,
    number
  >({
    queryKey: QUERY_KEYS.RECIPE.RECOMMENDED_LIST,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      console.log("pageParam", pageParam);

      const response = await apiClient.get<RecommendedRecipesResponse>(
        "/recipes/fridges-recommendation",
        {
          params: {
            startAfter: pageParam,
            size: PAGE_SIZE,
          },
        }
      );

      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.recipes.length === 0) return undefined;

      return lastPage.recipes[lastPage.recipes.length - 1].recipeId;
    },
    select: (data) => {
      const combinedResponse: RecommendedRecipesResponse = {
        totalCnt: data.pages[0]?.totalCnt || 0,
        recipes: data.pages.flatMap((page) => page.recipes),
      };

      return mapRecommendedRecipesResponse(combinedResponse);
    },
    staleTime: 1000 * 60,
  });
};
