import {
  FridgesResponse,
  FridgeIngredientCategoryResponse,
  IngredientResponse,
} from "../api/fridge";
import {
  Fridges,
  FridgeCategoryIngredients,
  Ingredient,
  FreshnessLevel,
} from "../domain/fridge";

export const mapFridgesResponse = (response: FridgesResponse): Fridges => ({
  basketCount: response.fridgeBasketCount,
  categories: response.fridgeIngredientCategories.map(
    mapFridgeIngredientCategory
  ),
});

const mapFridgeIngredientCategory = (
  category: FridgeIngredientCategoryResponse
): FridgeCategoryIngredients => ({
  categoryName: category.ingredientCategoryName,
  ingredients: category.fridges.map((fridge) =>
    mapFridge(
      fridge,
      category.ingredientCategoryId,
      category.ingredientCategoryName
    )
  ),
});

const mapFridge = (
  ingredient: IngredientResponse,
  categoryIdx: number,
  categoryName: string
): Ingredient => ({
  fridgeId: ingredient.fridgeId,
  categoryIdx,
  categoryName,
  name: ingredient.ingredientName,
  ingredientIconId: ingredient.ingredientIconId,
  expiredAt: ingredient.expiredAt,
  freshness: ingredient.freshness as FreshnessLevel,
  quantity: ingredient.quantity,
  unit: ingredient.unit,
});
