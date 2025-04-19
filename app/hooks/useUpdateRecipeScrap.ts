import { RecipeSourceType } from "@/constants/RecipeSourceType";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../lib/query/keys";
import { RecipeDetailResponse } from "../types/api/recipe";

interface RecipeScrapUpdate {
  recipeId: number;
  isScrapped: boolean;
}

/**
 * 레시피 페이지 업데이트
 */
export const useUpdateRecipeListScrapState = () => {
  const queryClient = useQueryClient();

  return ({ recipeId, isScrapped }: RecipeScrapUpdate) => {
    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.RECIPE.RECOMMENDED_LIST },
      (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            recipes: page.recipes.map((recipe: any) => {
              if (recipe.recipeId === recipeId) {
                return {
                  ...recipe,
                  isUserScrap: isScrapped,
                  scrapCnt: isScrapped
                    ? recipe.scrapCnt + 1
                    : recipe.scrapCnt - 1,
                };
              }
              return recipe;
            }),
          })),
        };
      }
    );
  };
};

/**
 * 레시피 상세 데이터의 스크랩 업데이트
 */
export const useUpdateRecipeDetailScrapState = () => {
  const queryClient = useQueryClient();

  return ({ recipeId, isScrapped }: RecipeScrapUpdate) => {
    queryClient.setQueriesData(
      { queryKey: [QUERY_KEYS.RECIPE.DETAIL, recipeId] },
      (old: RecipeDetailResponse) => {
        return {
          ...old,
          isUserScrap: isScrapped,
          scrapCnt: isScrapped ? old.scrapCnt + 1 : old.scrapCnt - 1,
        };
      }
    );
  };
};

/**
 * 레시피 검색 결과도 업데이트
 */
export const useUpdateSearchRecipeListScrapState = () => {
  const queryClient = useQueryClient();

  return ({ recipeId, isScrapped }: RecipeScrapUpdate) => {
    queryClient.setQueriesData(
      {
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "recipe-search",
      },
      (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            recipes: page.recipes.map((recipe: any) => {
              if (recipe.recipeId === recipeId) {
                return {
                  ...recipe,
                  isUserScrap: isScrapped,
                  scrapCnt: isScrapped
                    ? recipe.scrapCnt + 1
                    : recipe.scrapCnt - 1,
                };
              }
              return recipe;
            }),
          })),
        };
      }
    );
  };
};

/**
 * 나의 스크랩 목록 업데이트
 */
export const useUpdateMyScrapListScrapState = (type: RecipeSourceType) => {
  const queryClient = useQueryClient();

  return ({ recipeId, isScrapped }: RecipeScrapUpdate) => {
    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.RECIPE.SCRAP_LIST(type) },
      (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            recipes: page.recipes.filter(
              (recipe: any) => recipe.recipeId !== recipeId
            ), // 스크랩 목록만 내려주는 api 이므로 스크랩 해제 시 해당 레시피 제거
          })),
        };
      }
    );
  };
};

/**
 * 마이 페이지 스크랩 개수 업데이트
 */
export const useUpdateMyScrapCount = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.USER.INFO(),
    });
  };
};
