import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { PatchFridgeRequest } from "@/app/types/api/fridge";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePatchFridgeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatchFridgeRequest) => {
      const { fridgeId, ...body } = data;

      return apiClient.patch(`/fridges/${fridgeId}`, body);
    },
    onSuccess: (_, variables) => {
      // 냉장고 목록 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIDGE.FRIDGES });
      // 재료 상세 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FRIDGE.DETAIL(variables.fridgeId),
      });
    },
  });
};
