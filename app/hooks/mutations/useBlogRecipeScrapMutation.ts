import { apiClient } from "@/app/lib/api/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useUpdateSearchRecipeListScrapState } from "../useUpdateRecipeScrap";

/**
 * 블로그 레시피 스크랩 뮤테이션
 */
export const useBlogRecipeScrapMutation = () => {
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
      apiClient.post(`/recipes/blog/${recipeId}/scraps`),
    onSuccess: (_, recipeId) => handleSuccess(recipeId, true),
  });

  const removeScrap = useMutation({
    mutationFn: (recipeId: number) =>
      apiClient.delete(`/recipes/blog/${recipeId}/scraps`),
    onSuccess: (_, recipeId) => handleSuccess(recipeId, false),
  });

  return {
    addScrap: addScrap.mutate,
    removeScrap: removeScrap.mutate,
    isLoading: addScrap.isPending || removeScrap.isPending,
  };
};
