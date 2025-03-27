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
