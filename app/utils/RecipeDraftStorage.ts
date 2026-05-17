import { RecipeIngredientInput } from "@/app/types/api/recipe";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RecipeDraft {
  title: string;
  description: string;
  isPublic: boolean;
  selectedCookingLevel: string;
  cookingTime: number | null;
  stepInfo: string[];
  ingredients: Array<{
    id: number;
    ingredient: RecipeIngredientInput;
  }>;
  lastSavedAt: number;
  thumbnail: string | null;
}

const DRAFT_STORAGE_KEY = "recipe_draft";

const isValidDraft = (value: unknown): value is RecipeDraft => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.title === "string" &&
    typeof v.description === "string" &&
    typeof v.isPublic === "boolean" &&
    typeof v.selectedCookingLevel === "string" &&
    (typeof v.cookingTime === "number" || v.cookingTime === null) &&
    Array.isArray(v.stepInfo) &&
    Array.isArray(v.ingredients) &&
    (typeof v.thumbnail === "string" || v.thumbnail === null)
  );
};

export const RecipeDraftStorage = {
  // 임시 저장
  saveDraft: async (draft: Omit<RecipeDraft, "lastSavedAt">) => {
    try {
      const draftWithTimestamp: RecipeDraft = {
        ...draft,
        lastSavedAt: Date.now(),
      };
      await AsyncStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify(draftWithTimestamp)
      );
    } catch (error) {
      console.error("레시피 임시 저장 실패:", error);
    }
  },

  // 임시 저장 불러오기
  loadDraft: async (): Promise<RecipeDraft | null> => {
    try {
      const draftString = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
      if (!draftString) return null;

      const parsed = JSON.parse(draftString);
      if (!isValidDraft(parsed)) {
        // 구버전/손상된 draft는 폼이 깨지지 않도록 폐기
        await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch (error) {
      console.error("레시피 임시 저장 불러오기 실패:", error);
      return null;
    }
  },

  // 임시 저장 삭제
  clearDraft: async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
      console.error("레시피 임시 저장 삭제 실패:", error);
    }
  },

  // 임시 저장이 있는지 확인
  hasDraft: async (): Promise<boolean> => {
    try {
      const draftString = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
      return !!draftString;
    } catch (error) {
      console.error("레시피 임시 저장 확인 실패:", error);
      return false;
    }
  },
};
