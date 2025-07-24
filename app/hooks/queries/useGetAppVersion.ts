import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { useQuery } from "@tanstack/react-query";

export const useGetAppVersion = () => {
  const { data } = useQuery({
    queryKey: QUERY_KEYS.APP.VERSION(),
    queryFn: () => apiClient.get("/app/version"),
    select: (data) => data.data,
  });

  return {
    minimumAppVersion: data?.version,
  };
};
