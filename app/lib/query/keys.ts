import { RecipeSourceType } from "@/constants/RecipeSourceType";

export const QUERY_KEYS = {
  APP: {
    ROOT: ["app"] as const,
    VERSION: () => [...QUERY_KEYS.APP.ROOT, "version"] as const,
  },
  AUTH: {
    KAKAO: ["auth", "kakao"] as const,
    GOOGLE: ["auth", "google"] as const,
    NAVER: ["auth", "naver"] as const,
    AUTO_LOGIN: ["auth", "autoLogin"] as const,
  },
  FRIDGE: {
    FRIDGES: ["fridge", "fridges"] as const,
    DETAIL: (fridgeId: number) => ["fridge", "detail", fridgeId] as const,
    BASKET: ["fridge", "basket"] as const,
  },
  RECIPE: {
    ROOT: ["recipe"] as const,
    RECOMMENDED_LIST: () => [...QUERY_KEYS.RECIPE.ROOT, "recommended"] as const,
    SCRAP_LIST: (type: RecipeSourceType) =>
      [...QUERY_KEYS.RECIPE.ROOT, "scrap", type] as const,
    DETAIL: (recipeId: number) =>
      [...QUERY_KEYS.RECIPE.ROOT, "detail", recipeId] as const,
    SEARCH: (params: {
      keyword: string;
      size: number;
      sort: string;
      searchType: string;
    }) => [
      ...QUERY_KEYS.RECIPE.ROOT,
      "recipe-search",
      params.keyword,
      params.size,
      params.sort,
      params.searchType,
    ],
    MY_LIST: () => [...QUERY_KEYS.RECIPE.ROOT, "my-list"] as const,
  },
  SEARCH: {
    POPULAR_KEYWORDS: ["search", "popularKeywords"] as const,
  },
  USER: {
    ROOT: ["user"] as const,
    INFO: () => [...QUERY_KEYS.USER.ROOT, "info"] as const,
  },
  INGREDIENT: {
    PICK_LIST: (keyword?: string) => ["ingredients", "pick", keyword] as const,
    MY: (keyword?: string) => ["ingredients", "my", keyword] as const,
  },
} as const;
