export interface FridgesResponse {
  fridgeBasketCount: number;
  fridgeIngredientCategories: FridgeIngredientCategoryResponse[];
}

export interface FridgeIngredientCategoryResponse {
  ingredientCategoryId: number;
  ingredientCategoryName: string;
  fridges: IngredientResponse[];
}

export interface IngredientResponse {
  fridgeId: number;
  ingredientName: string;
  ingredientIconId: number | null;
  expiredAt: string | null;
  quantity: number;
  unit: string;
  freshness: string;
}

/**
 * 재료 수정 요청
 */
export interface PatchFridgeRequest {
  fridgeId: number;
  expiredAt: string | null;
  quantity: number;
  unit: string | null;
}
