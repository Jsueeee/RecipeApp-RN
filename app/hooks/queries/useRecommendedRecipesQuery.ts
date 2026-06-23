import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { RecommendedRecipesResponse } from "@/app/types/api/recipe";
import { mapRecommendedRecipesResponse } from "@/app/types/mappers/recipe";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

type UseRecommendedRecipesQueryOptions = {
  enabled?: boolean;
};

export const useRecommendedRecipesQuery = (
  options?: UseRecommendedRecipesQueryOptions,
) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.RECIPE.RECOMMENDED_LIST(),
      initialPageParam: 0,
      queryFn: async ({ pageParam = 0 }) => {
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
      enabled: options?.enabled ?? true,
    });

  return {
    recipes: data?.recipes,
    totalCount: data?.totalCount,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  };
};

type UsePublicRecommendedRecipesQueryOptions = {
  ingredientNames: string[];
  enabled?: boolean;
};

export const usePublicRecommendedRecipesQuery = ({
  ingredientNames,
  enabled = true,
}: UsePublicRecommendedRecipesQueryOptions) => {
  const ingredientsParam = ingredientNames.join(",");

  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [
        ...QUERY_KEYS.RECIPE.ROOT,
        "public-recommended",
        ingredientsParam,
      ] as const,
      initialPageParam: 0,
      queryFn: async ({ pageParam = 0 }) => {
        const response = await apiClient.get<RecommendedRecipesResponse>(
          "/recipes/public/recommendation",
          {
            params: {
              startAfter: pageParam === 0 ? "" : pageParam,
              size: PAGE_SIZE,
              ingredients: ingredientsParam,
            },
          },
        );

        return response.data;
      },
      getNextPageParam: (lastPage) => {
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
      enabled: enabled && ingredientNames.length > 0,
    });

  return {
    recipes: data?.recipes,
    totalCount: data?.totalCount,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  };
};
