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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIDGE.BASKET() });
      // 냉장고 삭제 → 안의 재료가 매칭 풀에서 빠지므로 RECIPE 전체 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECIPE.ROOT });
    },
  });
};
