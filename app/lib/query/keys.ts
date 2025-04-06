export const QUERY_KEYS = {
  AUTH: {
    KAKAO: ["auth", "kakao"] as const,
    AUTO_LOGIN: ["auth", "autoLogin"] as const,
  },
  FRIDGE: {
    FRIDGES: ["fridge", "fridges"] as const,
    DETAIL: (fridgeId: number) => ["fridge", "detail", fridgeId] as const,
  },
  RECIPE: {
    RECOMMENDED_LIST: ["recipe", "recommended"] as const,
  },
} as const;
