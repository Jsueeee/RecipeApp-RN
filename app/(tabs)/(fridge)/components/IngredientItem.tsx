import { Ingredient } from "@/app/types/domain/fridge";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { FreshnessLabel } from "./FreshnessLabel";
import { toConvertExpiredAt } from "@/app/utils/DateTimeUtils";
import { FoodDataManager } from "@/constants/IngredientManager";

interface Props extends Ingredient {
  onPress: () => void;
}

export function IngredientItem({
  name,
  quantity,
  unit,
  expiredAt,
  freshness,
  onPress,
  ingredientIconId,
}: Props) {
  const Icon = FoodDataManager.getImageSource(ingredientIconId);

  return (
    <Pressable
      className="flex-row items-center p-2 bg-white rounded-lg"
      onPress={onPress}
    >
      <View className="w-12 h-12 justify-center items-center">
        {Icon && <Icon width={40} height={40} />}
      </View>

      <View className="flex-1 ml-1 mr-4 gap-[2px]">
        <Text className="text-title5 text-text-strong">{name}</Text>

        <View className="flex-row items-center">
          <Text className="text-body3 text-text-alternative">
            {quantity}
            {unit}
          </Text>

          {expiredAt && <View className="w-px h-4 bg-gray-200 mx-2" />}

          {expiredAt && (
            <Text className="flex-1text-body3 text-text-alternative">
              {toConvertExpiredAt(expiredAt)}
            </Text>
          )}
        </View>
      </View>
      <FreshnessLabel freshness={freshness} />
    </Pressable>
  );
}
