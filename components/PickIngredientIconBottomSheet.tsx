import { CATEGORY_NAME_MAPPING } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { CategorizedPickIngredients } from "@/app/types/domain/ingredient";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { View } from "react-native";
import DefaultBottomSheetModal from "./DefaultBottomSheetModal";
import { IngredientIconGrid } from "./IngredientIconSectionGrid";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  onIconSelected: (iconId: number) => void;
}

export function PickIngredientIconBottomSheet({
  bottomSheetModalRef,
  onIconSelected,
}: Props) {
  const handleIconSelected = (iconId: number) => {
    onIconSelected(iconId);
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
      title={i18n.t("profile.edit_profile_image")}
      onDismiss={() => bottomSheetModalRef.current?.dismiss()}
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
