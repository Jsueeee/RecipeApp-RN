import { PressableScale } from "@/app/components/PressableScale";
import { Ingredient } from "@/app/types/domain/fridge";
import { toConvertExpiredAt } from "@/app/utils/DateTimeUtils";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";
import { FreshnessLabel } from "./FreshnessLabel";

interface Props extends Ingredient {
  onPress: () => void;
  isExpiredAtPlaceholderShow?: boolean;
}

export function IngredientItem({
  name,
  quantity,
  unit,
  expiredAt,
  freshness,
  onPress,
  ingredientIconId,
  isExpiredAtPlaceholderShow = false,
}: Props) {
  const Icon = FoodDataManager.getImageSource(ingredientIconId);

  return (
    <PressableScale
      className="w-full"
      style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}
      pressedStyle={{ backgroundColor: "#F7F8F7" }}
      onPress={onPress}
    >
      <View className="flex-row items-center">
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

            {(expiredAt || isExpiredAtPlaceholderShow) && (
              <View className="w-px h-4 bg-gray-200 mx-2" />
            )}

            {expiredAt ? (
              <Text className="flex-1 text-body3 text-text-alternative">
                {toConvertExpiredAt(expiredAt)}
              </Text>
            ) : (
              isExpiredAtPlaceholderShow && (
                <Text className="flex-1 text-body3 text-text-alternative">
                  {i18n.t("ingredient.expired_at_placeholder")}
                </Text>
              )
            )}
          </View>
        </View>
        <FreshnessLabel freshness={freshness} />
      </View>
    </PressableScale>
  );
}
