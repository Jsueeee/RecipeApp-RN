import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRecipeScrapMutation = () => {
  const queryClient = useQueryClient();

  const updateRecipeScrap = (recipeId: number, isScrapped: boolean) => {
    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.RECIPE.RECOMMENDED_LIST },
      (old: any) => {
        if (!old?.pages) return old;

        const newData = {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            recipes: page.recipes.map((recipe: any) => {
              if (recipe.recipeId === recipeId) {
                return {
                  ...recipe,
                  isUserScrap: isScrapped,
                  scrapCnt: isScrapped
                    ? recipe.scrapCnt + 1
                    : recipe.scrapCnt - 1,
                };
              }
              return recipe;
            }),
          })),
        };

        return newData;
      }
    );
  };

  const addScrap = useMutation({
    mutationFn: (recipeId: number) =>
      apiClient.post(`/recipes/${recipeId}/scraps`),
    onSuccess: (_, recipeId) => {
      updateRecipeScrap(recipeId, true);
    },
  });

  const removeScrap = useMutation({
    mutationFn: (recipeId: number) =>
      apiClient.delete(`/recipes/${recipeId}/scraps`),
    onSuccess: (_, recipeId) => {
      updateRecipeScrap(recipeId, false);
    },
  });

  return {
    addScrap: addScrap.mutate,
    removeScrap: removeScrap.mutate,
    isLoading: addScrap.isPending || removeScrap.isPending,
  };
};
