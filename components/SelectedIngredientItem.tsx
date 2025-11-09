import { PressableScale } from "@/app/components/PressableScale";
import SelectedCancelIcon from "@/assets/images/ic_selected_cancel.svg";
import { FoodDataManager } from "@/constants/IngredientManager";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  ingredientId: number;
  ingredientName: string;
  ingredientIconId: number | null;
  onRemovePress: () => void;
}

/**
 * 이미 선택된 재료 아이템을 나타낼 때 쓰는 뷰를
 * 오른쪽 상단에 취소할 수 있는 x 버튼이 있다
 */
export const SelectedIngredientItem = ({
  ingredientId,
  ingredientName,
  ingredientIconId,
  onRemovePress,
}: Props) => {
  const Icon = FoodDataManager.getImageSource(ingredientIconId);

  return (
    <View key={ingredientId} className="items-center">
      <View className="px-2">
        <View className="w-[46px] h-[46px] justify-center items-center">
          {Icon && <Icon width={46} height={46} />}
        </View>

        <PressableScale
          onPress={onRemovePress}
          className="absolute top-0 right-0"
          hitSlop={4}
        >
          <SelectedCancelIcon width={24} height={24} />
        </PressableScale>
      </View>

      <Text className="text-utility5 text-text-normal text-center">
        {ingredientName}
      </Text>
    </View>
  );
};
