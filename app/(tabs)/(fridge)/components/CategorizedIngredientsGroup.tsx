import { IngredientItem } from "@/app/(tabs)/(fridge)/components/IngredientItem";
import type { Ingredient } from "@/app/types/domain/fridge";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  categoryName: string;
  ingredients: Ingredient[];
  onIngredientItemClick: (ingredient: Ingredient) => void;
}

export function CategorizedIngredientsGroup({
  categoryName,
  ingredients,
  onIngredientItemClick,
}: Props) {
  return (
    <View className="bg-white rounded-2xl p-5 mb-4">
      <Text className="text-title4 text-text-strong mb-4">{categoryName}</Text>

      <View className="gap-2">
        {ingredients.map((ingredient) => (
          <IngredientItem
            key={ingredient.fridgeId}
            {...ingredient}
            onPress={() => onIngredientItemClick(ingredient)}
          />
        ))}
      </View>
    </View>
  );
}
