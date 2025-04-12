import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { UserInfoResponse } from "@/app/types/api/mypage";
import { mapUserInfoResponse } from "@/app/types/mappers/mypage";
import { useQuery } from "@tanstack/react-query";

export const useUserInfoQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER.INFO(),
    queryFn: async () => {
      const response = await apiClient.get<UserInfoResponse>("/users");
      return mapUserInfoResponse(response.data);
    },
    staleTime: 1000 * 60,
  });
};
