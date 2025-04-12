export interface UserRecipeResponse {
  recipeId: number;
  thumbnailImgUrl: string | null;
}

export interface UserInfoResponse {
  userId: number;
  profileImgUrl: string | null;
  nickname: string;
  email: string | null;
  loginProvider: string;
  youtubeScrapCnt: number;
  blogScrapCnt: number;
  recipeScrapCnt: number;
  userRecipeTotalSize: number;
  userRecipes: UserRecipeResponse[];
}
