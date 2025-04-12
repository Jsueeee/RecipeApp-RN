import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { SearchRecipeResponse } from "@/app/types/api/recipe";
import { SearchRecipeResult } from "@/app/types/domain/recipe";
import { mapSearchRecipeResponse } from "@/app/types/mappers/recipe";
import { SearchRecipesParams } from "@/app/types/request/search";
import { RECIPE_SOURCE_TYPE } from "@/constants/RecipeSourceType";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useSearchRecipesQuery = ({
  keyword,
  size,
  sort,
  searchType,
}: SearchRecipesParams) => {
  return useInfiniteQuery<SearchRecipeResponse, Error, SearchRecipeResult>({
    queryKey: QUERY_KEYS.RECIPE.SEARCH({ keyword, size, sort, searchType }),
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const endpoint = (() => {
        switch (searchType) {
          case RECIPE_SOURCE_TYPE.BLOG:
            return "/recipes/blog";
          case RECIPE_SOURCE_TYPE.YOUTUBE:
            return "/recipes/youtube";
          case RECIPE_SOURCE_TYPE.PUBLIC:
            return "/recipes";
        }
      })();

      const response = await apiClient.get<SearchRecipeResponse>(endpoint, {
        params: {
          keyword,
          startAfter: pageParam,
          size,
          sort,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.recipes.length === 0) return undefined;
      return lastPage.recipes[lastPage.recipes.length - 1].recipeId;
    },
    select: (data) => {
      const combinedResponse: SearchRecipeResponse = {
        totalCnt: data.pages[0]?.totalCnt || 0,
        recipes: data.pages.flatMap((page) => page.recipes),
      };
      return mapSearchRecipeResponse(combinedResponse);
    },
    enabled: !!keyword.trim(),
  });
};
