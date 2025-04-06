export interface RecipeSummaryList {
  totalCount: number;
  recipes: RecipeSummary[];
}

export interface RecipeSummary {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  isScrapped: boolean;
  viewCount: number;
  scrapCount: number;
  postDate: string;
  ingredientMatchRate: number;
  linkUrl?: string;
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
