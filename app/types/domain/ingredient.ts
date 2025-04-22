export interface PickIngredient {
  ingredientId: number;
  ingredientName: string;
  ingredientIconId: number | null;
}

export interface CategorizedPickIngredients {
  ingredientCategoryId: number;
  ingredientCategoryName: string;
  ingredients: PickIngredient[];
}
