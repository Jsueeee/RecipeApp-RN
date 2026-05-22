import { CATEGORY_NAME_MAPPING } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { CategorizedPickIngredients } from "@/app/types/domain/ingredient";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { View } from "react-native";
import DefaultBottomSheetModal from "./DefaultBottomSheetModal";
import { IngredientIconGrid } from "./IngredientIconSectionGrid";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  onIconSelected: (iconId: number | null) => void;
}

export function PickIngredientIconBottomSheet({
  bottomSheetModalRef,
  onIconSelected,
}: Props) {
  const selectedIconId = useRef<number | null>(null);

  const handleIconSelected = (iconId: number) => {
    selectedIconId.current = iconId;
    bottomSheetModalRef.current?.dismiss();
  };

  const onDismiss = () => {
    onIconSelected(selectedIconId.current);
    selectedIconId.current = null;
    bottomSheetModalRef.current?.dismiss();
  };

  const ingredientList = useMemo(() => {
    return Object.entries(FoodDataManager.getGroupedFoodList()).map(
      ([categoryId, ingredients]) =>
        ({
          ingredientCategoryId: Number(categoryId),
          ingredientCategoryName:
            CATEGORY_NAME_MAPPING[
              Number(categoryId) as keyof typeof CATEGORY_NAME_MAPPING
            ],
          ingredients: ingredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            ingredientName: ingredient.name,
            ingredientIconId: ingredient.iconId,
          })),
        } as CategorizedPickIngredients)
    );
  }, []);

  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title={i18n.t("custom_ingredient_create.select_icon")}
      onDismiss={onDismiss}
      scrollEnabled={false}
    >
      <View className="w-full max-h-[500px]">
        <IngredientIconGrid
          categorizedIngredients={ingredientList}
          onPress={handleIconSelected}
          isNameVisible={false}
        />
      </View>
    </DefaultBottomSheetModal>
  );
}
