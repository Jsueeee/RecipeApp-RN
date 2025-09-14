import { PressableScale } from "@/app/components/PressableScale";
import RemoveIcon from "@/assets/images/ic_selected_cancel.svg";
import { FoodDataManager } from "@/constants/IngredientManager";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

interface Props {
  ingredientId: number;
  ingredientName: string;
  ingredientIconId: number | null;
  onRemovePress: () => void;
}

export const RemoveIngredientItem = React.memo(
  function RemoveIngredientItem({
    ingredientId,
    ingredientName,
    ingredientIconId,
    onRemovePress,
  }: Props) {
    const Icon = useMemo(
      () => FoodDataManager.getImageSource(ingredientIconId),
      [ingredientIconId]
    );

    return (
      <View key={ingredientId} className="items-center w-[76px]">
        <View className="relative w-[60px] h-[60px] justify-center items-center">
          {Icon && <Icon width={60} height={60} />}

          <PressableScale
            onPress={onRemovePress}
            className="absolute top-0 -right-3"
            hitSlop={4}
          >
            <RemoveIcon width={32} height={32} />
          </PressableScale>
        </View>

        <Text className="text-utility3 text-text-normal text-center">
          {ingredientName}
        </Text>
      </View>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.ingredientId !== nextProps.ingredientId) return false;
    if (prevProps.ingredientIconId !== nextProps.ingredientIconId) return false;
    if (prevProps.ingredientName !== nextProps.ingredientName) return false;
    return true;
  }
);
