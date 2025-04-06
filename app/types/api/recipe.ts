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
