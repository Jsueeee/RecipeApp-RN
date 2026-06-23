import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { UserInfoResponse } from "@/app/types/api/mypage";
import { mapUserInfoResponse } from "@/app/types/mappers/mypage";
import { useQuery } from "@tanstack/react-query";
import { UserInfo } from "@/app/types/domain/mypage";

export const useUserInfoQuery = <T = UserInfo>(options?: {
  select?: (data: UserInfo) => T;
  enabled?: boolean;
}) => {
  const { data, isLoading, isError } = useQuery<UserInfo, Error, T>({
    queryKey: QUERY_KEYS.USER.INFO(),
    queryFn: async () => {
      const response = await apiClient.get<UserInfoResponse>("/users");
      return mapUserInfoResponse(response.data);
    },
    staleTime: 1000 * 60,
    select: options?.select,
    enabled: options?.enabled ?? true,
  });

  return {
    userInfo: data,
    isLoading,
    isError,
  };
};
