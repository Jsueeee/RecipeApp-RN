import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { MyRecipesResponse } from "@/app/types/api/recipe";
import { RecipeSummaryList } from "@/app/types/domain/recipe";
import { mapMyRecipesResponse } from "@/app/types/mappers/recipe";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

export const useMyRecipeListQuery = () => {
  return useInfiniteQuery<
    MyRecipesResponse,
    Error,
    RecipeSummaryList,
    typeof QUERY_KEYS.RECIPE.MY_LIST,
    number
  >({
    queryKey: QUERY_KEYS.RECIPE.MY_LIST,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.get<MyRecipesResponse>(
        "/recipes/users",
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
      const combinedResponse: MyRecipesResponse = {
        totalCnt: data.pages[0]?.totalCnt || 0,
        recipes: data.pages.flatMap((page) => page.recipes),
      };

      return mapMyRecipesResponse(combinedResponse);
    },
    staleTime: 1000 * 60,
  });
};
