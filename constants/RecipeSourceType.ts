export const RECIPE_SOURCE_TYPE = {
  BLOG: "블로그",
  YOUTUBE: "유튜브",
  PUBLIC: "공개",
} as const;

export type RecipeSourceType =
  (typeof RECIPE_SOURCE_TYPE)[keyof typeof RECIPE_SOURCE_TYPE];
