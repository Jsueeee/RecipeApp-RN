import i18n from "@/lib/i18n";
import React from "react";
import { Text } from "react-native";
import { IngredientFridgeType } from "./RecipeIngredients";

interface Props {
  type: IngredientFridgeType;
}

export const EmptyIngredientsPlaceholder = ({ type }: Props) => {
  const text = (() => {
    switch (type) {
      case IngredientFridgeType.IN_FRIDGE:
        return i18n.t("recipe_detail.in_fridge_is_empty");
      case IngredientFridgeType.NOT_IN_FRIDGE:
        return i18n.t("recipe_detail.not_in_fridge_is_empty");
    }
  })();

  return (
    <Text className="text-body2 text-text-assistive text-center mx-4 my-[30px]">
      {text}
    </Text>
  );
};
