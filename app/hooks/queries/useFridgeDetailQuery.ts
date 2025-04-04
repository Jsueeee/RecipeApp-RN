import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { IngredientDetail } from "@/app/types/domain/fridge";
import { useQuery } from "@tanstack/react-query";

export const useFridgeDetailQuery = (fridgeId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.FRIDGE.DETAIL(fridgeId),
    queryFn: async () => {
      const response = await apiClient.get<IngredientDetail>(
        `/fridges/${fridgeId}`
      );
      return response.data;
    },
    enabled: !!fridgeId,
    staleTime: 1000 * 60,
  });
};
