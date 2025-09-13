import {
  MyRecipeResponse,
  MyRecipesResponse,
  RecipeDetailResponse,
  RecipeIngredientResponse,
  RecipeProcessResponse,
  RecommendedRecipeResponse,
  RecommendedRecipesResponse,
  ScrapRecipeResponse,
  ScrapRecipesResponse,
  SearchRecipeItemResponse,
  SearchRecipeResponse,
} from "../api/recipe";
import {
  RecipeDetail,
  RecipeIngredient,
  RecipeProcess,
  RecipeSummary,
  RecipeSummaryList,
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
  isHidden: response.isHidden,
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

export const mapMyRecipesResponse = (
  response: MyRecipesResponse
): RecipeSummaryList => ({
  totalCount: response.totalCnt,
  recipes: response.recipes.map(mapMyRecipeResponse),
});

const mapMyRecipeResponse = (recipe: MyRecipeResponse): RecipeSummary => ({
  id: recipe.recipeId,
  title: recipe.recipeName,
  description: recipe.introduction ?? "",
  thumbnail: recipe.thumbnailImgUrl,
  isScrapped: recipe.isUserScrap,
  viewCount: recipe.viewCnt,
  scrapCount: recipe.scrapCnt,
  postDate: recipe.postDate ?? "",
  ingredientMatchRate: 0,
  linkUrl: undefined,
  postUserName: recipe.postUserName ?? undefined,
});

export const mapScrapRecipesResponse = (
  response: ScrapRecipesResponse
): RecipeSummaryList => ({
  totalCount: response.totalCnt,
  recipes: response.recipes.map(mapScrapRecipeResponse),
});

const mapScrapRecipeResponse = (
  recipe: ScrapRecipeResponse
): RecipeSummary => ({
  id: recipe.recipeId,
  title: recipe.recipeName,
  description: recipe.introduction ?? "",
  thumbnail: recipe.thumbnailImgUrl,
  isScrapped: recipe.isUserScrap,
  viewCount: recipe.viewCnt,
  scrapCount: recipe.scrapCnt,
  postDate: recipe.postDate,
  ingredientMatchRate: 0, // TODO: 여기도 추가 가능한지 서버 문의
  linkUrl: recipe.linkUrl,
  postUserName: recipe.postUserName ?? undefined,
});
