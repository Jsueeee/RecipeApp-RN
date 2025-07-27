import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { useQuery } from "@tanstack/react-query";

export const usePopularKeywordsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SEARCH.POPULAR_KEYWORDS(),
    queryFn: async () => {
      const response = await apiClient.get<string[]>("/recipes/best-keywords");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
