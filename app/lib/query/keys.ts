import { ScrapRecipeType } from "@/app/hooks/queries/useScrapRecipesQuery";

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
    SCRAP_LIST: (type: ScrapRecipeType) => ["recipe", "scrap", type] as const,
    DETAIL: (recipeId: number) => ["recipe", "detail", recipeId] as const,
    SEARCH: (params: {
      keyword: string;
      size: number;
      sort: string;
      searchType: string;
    }) => [
      "recipe-search",
      params.keyword,
      params.size,
      params.sort,
      params.searchType,
    ],
    MY_LIST: ["recipe", "my-list"] as const,
  },
  SEARCH: {
    POPULAR_KEYWORDS: ["search", "popularKeywords"] as const,
  },
  USER: {
    INFO: () => ["user", "info"],
  },
} as const;
