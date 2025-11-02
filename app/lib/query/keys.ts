import { RecipeSourceType } from "@/constants/RecipeSourceType";

export const QUERY_KEYS = {
  APP: {
    ROOT: ["app"] as const,
    VERSION: () => [...QUERY_KEYS.APP.ROOT, "version"] as const,
  },
  AUTH: {
    ROOT: ["auth"] as const,
    KAKAO: () => [...QUERY_KEYS.AUTH.ROOT, "kakao"] as const,
    GOOGLE: () => [...QUERY_KEYS.AUTH.ROOT, "google"] as const,
    NAVER: () => [...QUERY_KEYS.AUTH.ROOT, "naver"] as const,
    APPLE: () => [...QUERY_KEYS.AUTH.ROOT, "apple"] as const,
    AUTO_LOGIN: () => [...QUERY_KEYS.AUTH.ROOT, "autoLogin"] as const,
  },
  FRIDGE: {
    ROOT: ["fridge"] as const,
    FRIDGES: () => [...QUERY_KEYS.FRIDGE.ROOT, "fridges"] as const,
    DETAIL: (fridgeId: number) =>
      [...QUERY_KEYS.FRIDGE.ROOT, "detail", fridgeId] as const,
    BASKET: () => [...QUERY_KEYS.FRIDGE.ROOT, "basket"] as const,
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
    ROOT: ["search"] as const,
    POPULAR_KEYWORDS: () =>
      [...QUERY_KEYS.SEARCH.ROOT, "popularKeywords"] as const,
  },
  USER: {
    ROOT: ["user"] as const,
    INFO: () => [...QUERY_KEYS.USER.ROOT, "info"] as const,
    DELETE_ACCOUNT: () => [...QUERY_KEYS.USER.ROOT, "delete-account"] as const,
  },
  INGREDIENT: {
    ROOT: ["ingredients"] as const,
    PICK_LIST: (keyword?: string) =>
      [...QUERY_KEYS.INGREDIENT.ROOT, "pick", keyword] as const,
    MY: (keyword?: string) =>
      [...QUERY_KEYS.INGREDIENT.ROOT, "my", keyword] as const,
  },
} as const;
