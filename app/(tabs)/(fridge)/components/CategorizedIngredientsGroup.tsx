import { IngredientItem } from "@/app/(tabs)/(fridge)/components/IngredientItem";
import { TutorialAnchor } from "@/app/tutorial";
import type { AnchorId } from "@/app/tutorial/engine/types";
import type { Ingredient } from "@/app/types/domain/fridge";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  categoryName: string;
  ingredients: Ingredient[];
  onIngredientItemClick: (ingredient: Ingredient) => void;
  isExpiredAtPlaceholderShow?: boolean;
  firstIngredientAnchorId?: AnchorId;
}

export function CategorizedIngredientsGroup({
  categoryName,
  ingredients,
  onIngredientItemClick,
  isExpiredAtPlaceholderShow = false,
  firstIngredientAnchorId,
}: Props) {
  return (
    <View className="bg-white rounded-2xl p-5 mb-4">
      <Text className="text-title4 text-text-strong mb-4">{categoryName}</Text>

      <View className="gap-2">
        {ingredients.map((ingredient, index) => {
          const item = (
            <IngredientItem
              {...ingredient}
              onPress={() => onIngredientItemClick(ingredient)}
              isExpiredAtPlaceholderShow={isExpiredAtPlaceholderShow}
            />
          );

          if (index === 0 && firstIngredientAnchorId) {
            return (
              <TutorialAnchor
                key={ingredient.fridgeId}
                id={firstIngredientAnchorId}
                style={{ width: "100%" }}
              >
                {item}
              </TutorialAnchor>
            );
          }

          return (
            <React.Fragment key={ingredient.fridgeId}>{item}</React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
