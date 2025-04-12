export interface UserRecipeSummary {
  id: number;
  thumbnail: string | null;
}

export interface UserInfo {
  userId: number;
  profileImageUrl: string | null;
  nickname: string;
  email: string | null;
  loginProvider: string;
  youtubeScrapCnt: number;
  blogScrapCnt: number;
  recipeScrapCnt: number;
  userRecipeTotalSize: number;
  userRecipeSummaries: UserRecipeSummary[];
}
