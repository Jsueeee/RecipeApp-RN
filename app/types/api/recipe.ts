export interface RecommendedRecipesResponse {
  totalCnt: number;
  recipes: RecommendedRecipeResponse[];
}

export interface RecommendedRecipeResponse {
  thumbnailImgUrl: string;
  linkUrl?: string;
  ingredientsMatchRate: number;
  introduction?: string;
  isUserScrap: boolean;
  postDate: string;
  postUserName?: string;
  recipeId: number;
  recipeName: string;
  scrapCnt: number;
  viewCnt: number;
}

export interface RecipeDetailResponse {
  recipeId: number;
  recipeName: string;
  introduction?: string;
  thumbnailImgUrl?: string;
  cookingTime?: number;
  linkUrl?: string;
  level?: string;
  recipeIngredients: RecipeIngredientResponse[];
  recipeProcesses: RecipeProcessResponse[];
  isUserScrap: boolean;
  scrapCnt: number;
  viewCnt: number;
  postUserId?: number;
  postUserName?: string;
  isReported: boolean;
  isHidden: boolean;
}

export interface RecipeIngredientResponse {
  ingredientName: string;
  ingredientIconId?: number;
  quantity?: string;
  unit?: string;
  isInUserFridge: boolean;
}

export interface RecipeProcessResponse {
  recipeProcessId: number;
  recipeProcessNo: number;
  recipeProcessDescription?: string;
  recipeProcessImgUrl?: string;
}

export interface SearchRecipeResponse {
  totalCnt: number;
  recipes: SearchRecipeItemResponse[];
}

export interface SearchRecipeItemResponse {
  recipeId: number;
  recipeName: string;
  introduction: string | null;
  thumbnailImgUrl: string | null;
  postUserName: string | null;
  postDate: string | null;
  isUserScrap: boolean;
  scrapCnt: number;
  viewCnt: number;
  linkUrl: string | null;
}

export interface MyRecipesResponse {
  totalCnt: number;
  recipes: MyRecipeResponse[];
}

export interface MyRecipeResponse {
  recipeId: number;
  recipeName: string;
  introduction: string | null;
  thumbnailImgUrl: string | null;
  postUserName: string | null;
  postDate: string | null;
  isUserScrap: boolean;
  scrapCnt: number;
  viewCnt: number;
}

export interface ScrapRecipesResponse {
  totalCnt: number;
  recipes: ScrapRecipeResponse[];
}

export interface ScrapRecipeResponse {
  recipeId: number;
  recipeName: string;
  introduction: string | null;
  thumbnailImgUrl: string | null;
  postUserName: string | null;
  postDate: string | null;
  isUserScrap: boolean;
  scrapCnt: number;
  viewCnt: number;
  linkUrl?: string | null;
}

export interface RecipeIngredientInput {
  ingredientName: string;
  ingredientIconId?: number | null;
  quantity?: string;
  unit?: string;
}

export interface RecipeProcessRequest {
  cookingNo: number;
  cookingDescription: string;
  cookingImgUrl?: string;
}

export interface CreateRecipeRequest {
  title: string;
  introduction: string;
  thumbnailImgUrl?: string;
  cookingTime: number;
  level: "EASY" | "NORMAL" | "HARD";
  isHidden: boolean;
  ingredients: RecipeIngredientInput[];
  processes: RecipeProcessRequest[];
}
