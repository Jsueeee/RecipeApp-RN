import { apiClient } from "@/app/lib/api/client";
import { RECIPE_SOURCE_TYPE } from "@/constants/RecipeSourceType";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  useUpdateMyScrapCount,
  useUpdateMyScrapListScrapState,
  useUpdateSearchRecipeListScrapState,
} from "../useUpdateRecipeScrap";

/**
 * 블로그 레시피 스크랩 뮤테이션
 */
export const useBlogRecipeScrapMutation = () => {
  const updateSearchRecipeList = useUpdateSearchRecipeListScrapState();
  const updateMyScrapList = useUpdateMyScrapListScrapState(
    RECIPE_SOURCE_TYPE.BLOG
  );
  const updateMyScrapCount = useUpdateMyScrapCount();

  const handleSuccess = useCallback(
    (recipeId: number, isScrapped: boolean) => {
      const update = { recipeId, isScrapped };
      updateSearchRecipeList(update);
      updateMyScrapList(update);
      updateMyScrapCount();
    },
    [updateSearchRecipeList, updateMyScrapList, updateMyScrapCount]
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
