import { CATEGORY_NAME_MAPPING } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { CategorizedPickIngredients } from "@/app/types/domain/ingredient";
import {
  CategoryId,
  FoodDataManager,
} from "@/constants/IngredientManager";

export const getLocalPickIngredients = (): CategorizedPickIngredients[] =>
  Object.entries(FoodDataManager.getGroupedFoodList()).map(
    ([categoryId, ingredients]) => {
      const ingredientCategoryId = Number(categoryId) as CategoryId;

      return {
        ingredientCategoryId,
        ingredientCategoryName: CATEGORY_NAME_MAPPING[ingredientCategoryId],
        ingredients: ingredients.map((ingredient) => ({
          ingredientId: ingredient.ingredientId,
          ingredientName: ingredient.name,
          ingredientIconId: ingredient.iconId,
        })),
      };
    },
  );
