import PickIngredientIcon from "@/assets/images/ic_pick_ingredient.svg";
import { FoodDataManager } from "@/constants/IngredientManager";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  ingredientId: number;
  ingredientName: string;
  ingredientIconId: number | null;
  isSelected: boolean;
}

export function PickIngredientItem({
  ingredientId,
  ingredientName,
  ingredientIconId,
  isSelected,
}: Props) {
  const Icon = FoodDataManager.getImageSource(ingredientIconId);

  return (
    <View key={ingredientId} className="items-center flex-1">
      <View className="px-2">
        <View className="w-[60px] h-[60px] justify-center items-center">
          {Icon && <Icon width={60} height={60} />}
        </View>

        {isSelected && (
          <View className="absolute top-0 left-0">
            <PickIngredientIcon width={24} height={24} />
          </View>
        )}
      </View>

      <Text className="text-utility3 text-text-normal text-center">
        {ingredientName}
      </Text>
    </View>
  );
}
