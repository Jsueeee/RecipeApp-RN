import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { ScrapRecipesResponse } from "@/app/types/api/recipe";
import { mapScrapRecipesResponse } from "@/app/types/mappers/recipe";
import {
  RECIPE_SOURCE_TYPE,
  RecipeSourceType,
} from "@/constants/RecipeSourceType";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

export const useScrapRecipesQuery = (type: RecipeSourceType) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.RECIPE.SCRAP_LIST(type),
      initialPageParam: 0,
      queryFn: async ({ pageParam = 0 }) => {
        let endpoint = "";
        switch (type) {
          case RECIPE_SOURCE_TYPE.YOUTUBE:
            endpoint = "/recipes/youtube/scraps";
            break;
          case RECIPE_SOURCE_TYPE.BLOG:
            endpoint = "/recipes/blog/scraps";
            break;
          case RECIPE_SOURCE_TYPE.PUBLIC:
            endpoint = "/recipes/scraps";
            break;
        }

        const response = await apiClient.get<ScrapRecipesResponse>(endpoint, {
          params: {
            startAfter: pageParam,
            size: PAGE_SIZE,
          },
        });

        return response.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.recipes.length === 0) return undefined;

        return lastPage.recipes[lastPage.recipes.length - 1].recipeId;
      },
      select: (data) => {
        const combinedResponse: ScrapRecipesResponse = {
          totalCnt: data.pages[0]?.totalCnt || 0,
          recipes: data.pages.flatMap((page) => page.recipes),
        };

        return mapScrapRecipesResponse(combinedResponse);
      },
      staleTime: 1000 * 60,
    });

  return {
    recipes: data?.recipes,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  };
};
