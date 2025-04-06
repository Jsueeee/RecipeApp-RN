import i18n from "@/lib/i18n";
import React from "react";
import { Text } from "react-native";
import { IngredientFridgeType } from "./RecipeIngredients";

interface Props {
  type: IngredientFridgeType;
}

export const EmptyIngredientsPlaceholder = ({ type }: Props) => {
  return (
    <Text className="text-body2 text-text-assistive text-center mx-4 my-[30px]">
      {i18n.t(`recipe_detail.${type}_is_empty`)}
    </Text>
  );
};
