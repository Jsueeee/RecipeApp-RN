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

export type FridgeTabKey = keyof typeof FridgeTabs;
