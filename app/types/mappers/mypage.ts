import { UserInfoResponse, UserRecipeResponse } from "../api/mypage";
import { UserInfo, UserRecipeSummary } from "../domain/mypage";

const mapUserRecipeResponse = (
  response: UserRecipeResponse
): UserRecipeSummary => ({
  id: response.recipeId,
  thumbnail: response.thumbnailImgUrl,
});

export const mapUserInfoResponse = (response: UserInfoResponse): UserInfo => ({
  userId: response.userId,
  profileImageUrl: response.profileImgUrl,
  nickname: response.nickname,
  email: response.email,
  loginProvider: response.loginProvider,
  youtubeScrapCnt: response.youtubeScrapCnt,
  blogScrapCnt: response.blogScrapCnt,
  recipeScrapCnt: response.recipeScrapCnt,
  userRecipeTotalSize: response.userRecipeTotalSize,
  userRecipeSummaries: response.userRecipes.map(mapUserRecipeResponse),
});
