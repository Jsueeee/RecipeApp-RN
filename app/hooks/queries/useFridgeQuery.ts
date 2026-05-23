import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { FridgesResponse } from "@/app/types/api/fridge";
import { Fridges } from "@/app/types/domain/fridge";
import { mapFridgesResponse } from "@/app/types/mappers/fridge";
import { useQuery } from "@tanstack/react-query";

type UseFridgesQueryOptions = {
  enabled?: boolean;
};

export const useFridgesQuery = (options?: UseFridgesQueryOptions) => {
  const { data, isLoading, isError } = useQuery<
    FridgesResponse,
    Error,
    Fridges
  >({
    queryKey: QUERY_KEYS.FRIDGE.FRIDGES(),
    queryFn: async () => {
      const response = await apiClient.get<FridgesResponse>("/fridges");
      return response.data;
    },
    select: mapFridgesResponse,
    enabled: options?.enabled ?? true,
  });

  return {
    basketCount: data?.basketCount,
    fridges: data?.categories,
    isLoading,
    isError,
  };
};
