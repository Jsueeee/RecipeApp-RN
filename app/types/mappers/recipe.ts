import {
  RecommendedRecipesResponse,
  RecommendedRecipeResponse,
} from "../api/recipe";
import { RecipeSummaryList, RecipeSummary } from "../domain/recipe";

export const mapRecommendedRecipesResponse = (
  response: RecommendedRecipesResponse
): RecipeSummaryList => ({
  totalCount: response.totalCount,
  recipes: response.recipes.map(mapRecommendedRecipeResponse),
});

const mapRecommendedRecipeResponse = (
  recipe: RecommendedRecipeResponse
): RecipeSummary => ({
  id: recipe.recipeId,
  title: recipe.recipeName,
  description: recipe.introduction ?? "",
  thumbnail: recipe.thumbnailImgUrl,
  isScrapped: recipe.isUserScrap,
  viewCount: recipe.viewCnt,
  scrapCount: recipe.scrapCnt,
  postDate: recipe.postDate,
  ingredientMatchRate: recipe.ingredientsMatchRate,
  linkUrl: recipe.linkUrl,
  postUserName: recipe.postUserName,
});
