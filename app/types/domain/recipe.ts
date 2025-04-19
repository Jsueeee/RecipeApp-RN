export interface RecipeSummaryList {
  totalCount: number;
  recipes: RecipeSummary[];
}

export interface RecipeSummary {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  isScrapped: boolean;
  viewCount: number;
  scrapCount: number;
  postDate: string | null;
  ingredientMatchRate: number;
  linkUrl?: string | null;
  postUserName?: string;
}

export interface RecipeDetail {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  cookingTime?: number;
  link?: string;
  level?: string;
  isScrap: boolean;
  scrapCount: number;
  viewCount: number;
  postUserId?: number;
  postUserName?: string;
  isReported: boolean;
  ingredients: RecipeIngredient[];
  processes: RecipeProcess[];
}

export interface RecipeIngredient {
  name: string;
  iconId?: number;
  quantity?: string;
  unit?: string;
  isInFridge: boolean;
}

export interface RecipeProcess {
  id: number;
  no: number;
  description?: string;
  imageUrl?: string;
}

export interface SearchRecipeResult {
  totalCnt: number;
  recipes: SearchRecipe[];
}

export interface SearchRecipe {
  recipeId: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  postUserName: string | null;
  postDate: string | null;
  isScrapped: boolean;
  scrapCount: number;
  viewCount: number;
  url: string | null;
}
