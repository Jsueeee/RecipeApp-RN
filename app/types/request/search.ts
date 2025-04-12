import { RecipeSourceType } from "@/constants/RecipeSourceType";

export interface SearchRecipesParams {
  keyword: string;
  size: number;
  sort: string;
  searchType: RecipeSourceType;
}
