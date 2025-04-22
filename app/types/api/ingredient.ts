export interface ResponsePickIngredient {
  ingredientId: number;
  ingredientIconId: number | null;
  ingredientName: string;
}

export interface ResponsePickIngredientsCategory {
  ingredientCategoryId: number;
  ingredientCategoryName: string;
  ingredients: ResponsePickIngredient[];
}

export interface ResponsePickIngredients {
  fridgeBasketCount: number;
  ingredientCategories: ResponsePickIngredientsCategory[];
}
