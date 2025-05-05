import { PressableScale } from "@/app/components/PressableScale";
import PickIngredientIcon from "@/assets/images/ic_pick_ingredient.svg";
import { FoodDataManager } from "@/constants/IngredientManager";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

interface Props {
  ingredientId: number;
  ingredientName: string;
  ingredientIconId: number | null;
  isSelected: boolean;
  onPress: () => void;
  isNameVisible?: boolean;
}

const iconCache = new Map<number, React.ComponentType<any>>();

const PickIngredientItem = React.memo(
  function PickIngredientItem({
    ingredientId,
    ingredientName,
    ingredientIconId,
    isSelected,
    onPress,
    isNameVisible = true,
  }: Props) {
    const Icon = useMemo(() => {
      if (!ingredientIconId) return null;

      if (iconCache.has(ingredientIconId)) {
        return iconCache.get(ingredientIconId)!;
      }

      const icon = FoodDataManager.getImageSource(ingredientIconId);
      if (icon) {
        iconCache.set(ingredientIconId, icon);
      }
      return icon;
    }, [ingredientIconId]);

    return (
      <PressableScale
        onPress={onPress}
        hitSlop={10}
        className="items-center w-[76px]"
      >
        <View className="relative w-[60px] h-[60px] justify-center items-center">
          {Icon && <Icon width={60} height={60} />}

          {isSelected && (
            <View className="absolute top-0 left-0">
              <PickIngredientIcon width={24} height={24} />
            </View>
          )}
        </View>

        {isNameVisible && (
          <Text className="text-utility3 text-text-normal text-center">
            {ingredientName}
          </Text>
        )}
      </PressableScale>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.isSelected !== nextProps.isSelected) return false;
    if (prevProps.ingredientId !== nextProps.ingredientId) return false;
    if (prevProps.ingredientIconId !== nextProps.ingredientIconId) return false;
    if (prevProps.ingredientName !== nextProps.ingredientName) return false;
    return true;
  } // 이걸 제거하면 느려짐
);

export { PickIngredientItem };
