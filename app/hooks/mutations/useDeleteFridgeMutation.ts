import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteFridgeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fridgeId: number) => {
      const response = await apiClient.delete(`/fridges/${fridgeId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIDGE.FRIDGES() });
    },
  });
};
