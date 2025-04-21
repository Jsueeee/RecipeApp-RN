import {
  ResponsePickIngredients,
  ResponsePickIngredientsCategory,
  ResponsePickIngredient,
} from "../api/ingredient";
import {
  CategorizedPickIngredients,
  PickIngredient,
} from "../domain/ingredient";

export const mapPickIngredientsResponse = (
  response: ResponsePickIngredients
): CategorizedPickIngredients[] =>
  response.ingredientCategories.map(mapPickIngredientsCategory);

const mapPickIngredientsCategory = (
  category: ResponsePickIngredientsCategory
): CategorizedPickIngredients => ({
  ingredientCategoryId: category.ingredientCategoryId,
  ingredients: category.ingredients.map(mapPickIngredient),
});

const mapPickIngredient = (
  ingredient: ResponsePickIngredient
): PickIngredient => ({
  ingredientId: ingredient.ingredientId,
  ingredientName: ingredient.ingredientName,
  ingredientIconId: ingredient.ingredientIconId,
});
