import { apiClient } from "@/app/lib/api/client";
import { useMutation } from "@tanstack/react-query";

export const useDeleteMyRecipeMutation = () => {
  const deleteMutation = useMutation({
    mutationFn: (recipeId: number) => apiClient.delete(`/recipes/${recipeId}`),
  });

  return {
    deleteMyRecipe: deleteMutation.mutate,
    isLoading: deleteMutation.isPending,
  };
};
