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
