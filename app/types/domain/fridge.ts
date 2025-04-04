export enum FreshnessLevel {
  FRESH = "FRESH", // 신선 상태
  RISKY = "RISKY", // 위험 상태
  SPOILED = "SPOILED", // 폐기 상태
}

export interface Ingredient {
  fridgeId: number;
  categoryIdx: number;
  categoryName: string;
  name: string;
  ingredientIconId: number | null;
  expiredAt: string | null;
  freshness: FreshnessLevel;
  quantity: number;
  unit: string;
}

export interface FridgeCategoryIngredients {
  categoryName: string;
  ingredients: Ingredient[];
}

export interface Fridges {
  basketCount: number;
  categories: FridgeCategoryIngredients[];
}

/**
 * 단건 조회 응답 - 수정 화면에서 사용 (카테고리 id 없음)
 */
export interface IngredientDetail {
  fridgeId: number;
  ingredientName: string;
  ingredientIconId: number | null;
  expiredAt: string | null;
  quantity: number;
  unit: string;
  freshness: string;
}
