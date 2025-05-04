import { CATEGORY_IDS } from "@/constants/IngredientManager";

export const FridgeTabs = {
  ALL: "전체",
  VEGETABLE: "채소",
  FRUIT: "과일",
  MEAT: "육류",
  SEAFOOD: "수산물",
  SAUCE: "조미료",
  DAIRY: "가공/유제품",
  ETC: "기타",
} as const;

export const CATEGORY_MAPPING = {
  [FridgeTabs.VEGETABLE]: CATEGORY_IDS.VEGETABLES,
  [FridgeTabs.FRUIT]: CATEGORY_IDS.FRUITS,
  [FridgeTabs.MEAT]: CATEGORY_IDS.MEAT,
  [FridgeTabs.SEAFOOD]: CATEGORY_IDS.MARINE,
  [FridgeTabs.SAUCE]: CATEGORY_IDS.SEASONING,
  [FridgeTabs.DAIRY]: CATEGORY_IDS.PROCESSED,
  [FridgeTabs.ETC]: CATEGORY_IDS.ETC,
} as const;

export type FridgeTabKey = keyof typeof FridgeTabs;
