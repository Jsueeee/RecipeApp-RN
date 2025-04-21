export interface PickIngredient {
  ingredientId: number;
  ingredientName: string;
  ingredientIconId?: number;
}

export interface CategorizedPickIngredients {
  ingredientCategoryId: number;
  ingredients: PickIngredient[];
}
