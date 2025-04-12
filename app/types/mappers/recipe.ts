import {
  RecommendedRecipesResponse,
  RecommendedRecipeResponse,
  RecipeDetailResponse,
  RecipeIngredientResponse,
  RecipeProcessResponse,
  SearchRecipeResponse,
  SearchRecipeItemResponse,
} from "../api/recipe";
import {
  RecipeSummaryList,
  RecipeSummary,
  RecipeDetail,
  RecipeIngredient,
  RecipeProcess,
  SearchRecipe,
  SearchRecipeResult,
} from "../domain/recipe";

export const mapRecommendedRecipesResponse = (
  response: RecommendedRecipesResponse
): RecipeSummaryList => ({
  totalCount: response.totalCnt,
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

export const mapRecipeDetailResponse = (
  response: RecipeDetailResponse
): RecipeDetail => ({
  id: response.recipeId,
  title: response.recipeName,
  description: response.introduction,
  thumbnail: response.thumbnailImgUrl,
  cookingTime: response.cookingTime,
  link: response.linkUrl,
  level: response.level,
  isScrap: response.isUserScrap,
  scrapCount: response.scrapCnt,
  viewCount: response.viewCnt,
  postUserId: response.postUserId,
  postUserName: response.postUserName,
  isReported: response.isReported,
  ingredients: response.recipeIngredients.map(mapRecipeIngredientResponse),
  processes: response.recipeProcesses.map(mapRecipeProcessResponse),
});

const mapRecipeIngredientResponse = (
  response: RecipeIngredientResponse
): RecipeIngredient => ({
  name: response.ingredientName,
  iconId: response.ingredientIconId,
  quantity: response.quantity,
  unit: response.unit,
  isInFridge: response.isInUserFridge,
});

const mapRecipeProcessResponse = (
  response: RecipeProcessResponse
): RecipeProcess => ({
  id: response.recipeProcessId,
  no: response.recipeProcessNo,
  description: response.recipeProcessDescription,
  imageUrl: response.recipeProcessImgUrl,
});

export const mapSearchRecipeResponse = (
  response: SearchRecipeResponse
): SearchRecipeResult => ({
  totalCnt: response.totalCnt,
  recipes: response.recipes.map(mapSearchRecipeItemResponse),
});

const mapSearchRecipeItemResponse = (
  response: SearchRecipeItemResponse
): SearchRecipe => ({
  recipeId: response.recipeId,
  title: response.recipeName,
  description: response.introduction,
  thumbnail: response.thumbnailImgUrl,
  postUserName: response.postUserName,
  postDate: response.postDate,
  isScrapped: response.isUserScrap,
  scrapCount: response.scrapCnt,
  viewCount: response.viewCnt,
  url: response.linkUrl,
});
