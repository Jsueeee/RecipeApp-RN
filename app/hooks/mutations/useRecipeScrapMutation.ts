import { apiClient } from "@/app/lib/api/client";
import { RECIPE_SOURCE_TYPE } from "@/constants/RecipeSourceType";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  useUpdateMyScrapListScrapState,
  useUpdateRecipeDetailScrapState,
  useUpdateRecipeListScrapState,
  useUpdateSearchRecipeListScrapState,
} from "../useUpdateRecipeScrap";

/**
 * 추천 레시피 스크랩 뮤테이션
 * 블로그, 유튜브는 따로 관리한다
 */
export const useRecipeScrapMutation = () => {
  const updateRecommendedList = useUpdateRecipeListScrapState();
  const updateRecipeDetail = useUpdateRecipeDetailScrapState();
  const updateSearchRecipeList = useUpdateSearchRecipeListScrapState();
  const updateMyScrapList = useUpdateMyScrapListScrapState(
    RECIPE_SOURCE_TYPE.PUBLIC
  );

  const handleSuccess = useCallback(
    (recipeId: number, isScrapped: boolean) => {
      const update = { recipeId, isScrapped };
      updateRecommendedList(update);
      updateRecipeDetail(update);
      updateSearchRecipeList(update);
      updateMyScrapList(update);
    },
    [
      updateRecommendedList,
      updateRecipeDetail,
      updateSearchRecipeList,
      updateMyScrapList,
    ]
  );

  const addScrap = useMutation({
    mutationFn: (recipeId: number) =>
      apiClient.post(`/recipes/${recipeId}/scraps`),
    onSuccess: (_, recipeId) => handleSuccess(recipeId, true),
  });

  const removeScrap = useMutation({
    mutationFn: (recipeId: number) =>
      apiClient.delete(`/recipes/${recipeId}/scraps`),
    onSuccess: (_, recipeId) => handleSuccess(recipeId, false),
  });

  return {
    addScrap: addScrap.mutate,
    removeScrap: removeScrap.mutate,
    isLoading: addScrap.isPending || removeScrap.isPending,
  };
};
