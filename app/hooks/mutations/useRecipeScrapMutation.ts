import { apiClient } from "@/app/lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  useUpdateRecipeDetailScrapState,
  useUpdateRecipeListScrapState,
} from "../useUpdateRecipeScrap";

export const useRecipeScrapMutation = () => {
  const queryClient = useQueryClient();
  const updateRecommendedList = useUpdateRecipeListScrapState();
  const updateRecipeDetail = useUpdateRecipeDetailScrapState();

  const handleSuccess = useCallback(
    (recipeId: number, isScrapped: boolean) => {
      const update = { recipeId, isScrapped };
      updateRecommendedList(update);
      updateRecipeDetail(update);
    },
    [updateRecommendedList, updateRecipeDetail]
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
