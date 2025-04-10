export const RECIPE_SOURCE_TYPE = ["블로그", "유튜브", "추천"] as const;

export type RecipeSourceType = (typeof RECIPE_SOURCE_TYPE)[number];
