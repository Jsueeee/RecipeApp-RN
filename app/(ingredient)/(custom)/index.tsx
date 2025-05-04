import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { PressableScale } from "@/app/components/PressableScale";
import { useDeleteMyIngredient } from "@/app/hooks/mutations/useDeleteMyIngredient";
import { useMyIngredientsQuery } from "@/app/hooks/queries/useMyIngredientsQuery";
import { PickIngredient } from "@/app/types/domain/ingredient";
import PlusIcon from "@/assets/images/ic_plus.svg";
import { ChoiceDialog } from "@/components/ChoiceDialog";
import { IngredientIconGrid } from "@/components/IngredientIconSectionGrid";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

const TABS = Object.values(FridgeTabs);

export default function CustomIngredientScreen() {
  const { categorizedIngredients, isLoading } = useMyIngredientsQuery({});
  const { deleteIngredient, isDeleteLoading } = useDeleteMyIngredient({
    onSuccess: () => {
      setSelectedDeleteIngredient(null);
    },
  });
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedDeleteIngredient, setSelectedDeleteIngredient] =
    useState<PickIngredient | null>(null);

  const handleTabSelect = useCallback((index: number) => {
    setSelectedTabIndex(index);
  }, []);

  const onCreateIngredientButtonPress = useCallback(() => {
    console.log("custom");
  }, []);

  const handleDeleteClick = useCallback((ingredient: PickIngredient) => {
    setSelectedDeleteIngredient(ingredient);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedDeleteIngredient !== null) {
      deleteIngredient(selectedDeleteIngredient.ingredientId);
    }
  }, [selectedDeleteIngredient, deleteIngredient]);

  const handleCancelDelete = useCallback(() => {
    setSelectedDeleteIngredient(null);
  }, []);

  const renderRightButtons = useCallback(() => {
    return [
      <View className="flex-row gap-4">
        <PressableScale
          key="custom"
          onPress={onCreateIngredientButtonPress}
          hitSlop={4}
        >
          <PlusIcon width={24} height={24} />
        </PressableScale>
      </View>,
    ];
  }, [onCreateIngredientButtonPress]);

  const filteredIngredients = useMemo(
    () =>
      categorizedIngredients
        ?.filter(
          (category) =>
            selectedTabIndex === 0 ||
            category.ingredientCategoryName === TABS[selectedTabIndex]
        )
        .filter((category) => category.ingredients.length > 0),
    [categorizedIngredients, selectedTabIndex]
  );

  return (
    <>
      <ScreenLayout
        title={i18n.t("custom_ingredient.app_bar_title")}
        rightButtonIcons={renderRightButtons()}
      >
        <View>
          <CategoryTabs
            tabs={TABS}
            selectedTabIndex={selectedTabIndex}
            onSelectTabIndex={handleTabSelect}
            className="bg-white w-full"
          />
        </View>

        <IngredientIconGrid
          categorizedIngredients={filteredIngredients ?? []}
          isRemoveMode={true}
          onRemoveButtonPress={handleDeleteClick}
          className="bg-white"
        />
      </ScreenLayout>

      <ChoiceDialog
        visible={selectedDeleteIngredient !== null}
        title={i18n.t("custom_ingredient.delete_dialog_title")}
        message={i18n.t("custom_ingredient.delete_dialog_desc", {
          ingredientName: selectedDeleteIngredient?.ingredientName,
        })}
        confirmText={i18n.t("custom_ingredient.delete_dialog_confirm")}
        cancelText={i18n.t("custom_ingredient.delete_dialog_cancel")}
        isConfirmLoading={isDeleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
