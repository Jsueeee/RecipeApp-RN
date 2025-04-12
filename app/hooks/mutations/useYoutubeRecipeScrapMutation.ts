import { apiClient } from "@/app/lib/api/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useUpdateSearchRecipeListScrapState } from "../useUpdateRecipeScrap";

export const useYoutubeRecipeScrapMutation = () => {
  const updateSearchRecipeList = useUpdateSearchRecipeListScrapState();

  const handleSuccess = useCallback(
    (recipeId: number, isScrapped: boolean) => {
      const update = { recipeId, isScrapped };
      updateSearchRecipeList(update);
    },
    [updateSearchRecipeList]
  );

  const addScrap = useMutation({
    mutationFn: (recipeId: number) =>
      apiClient.post(`/recipes/youtube/${recipeId}/scraps`),
    onSuccess: (_, recipeId) => handleSuccess(recipeId, true),
  });

  const removeScrap = useMutation({
    mutationFn: (recipeId: number) =>
      apiClient.delete(`/recipes/youtube/${recipeId}/scraps`),
    onSuccess: (_, recipeId) => handleSuccess(recipeId, false),
  });

  return {
    addScrap: addScrap.mutate,
    removeScrap: removeScrap.mutate,
    isLoading: addScrap.isPending || removeScrap.isPending,
  };
};
