import React from "react";
import { View, Text, Pressable } from "react-native";
import { FreshnessLabel } from "./FreshnessLabel";
import { Ingredient } from "@/app/types/domain/fridge";

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
}: Props) {
  return (
    <Pressable
      className="flex-row items-center p-2 bg-white rounded-lg"
      onPress={onPress}
    >
      {/* TODO : 아이콘 이미지 추가 */}
      <View className="w-12 h-12 bg-gray-100" />

      <View className="flex-1 ml-1 mr-4">
        <Text className="text-title5 text-text-strong">{name}</Text>

        <View className="flex-row items-center mt-[2px]">
          <Text className="text-body3 text-text-alternative">
            {quantity}
            {unit}
          </Text>

          {expiredAt && <View className="w-px h-4 bg-gray-200 mx-2" />}

          {expiredAt && (
            <Text className="text-body3 text-text-alternative">
              {expiredAt}
            </Text>
          )}
        </View>
      </View>

      <FreshnessLabel freshness={freshness} />
    </Pressable>
  );
}
