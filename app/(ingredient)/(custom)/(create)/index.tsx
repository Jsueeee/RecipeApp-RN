import { PressableScale } from "@/app/components/PressableScale";
import { useDefaultBottomSheetModal } from "@/app/hooks/useDefaultBottomSheetModal";
import SelectIngredientIconImage from "@/assets/images/img_select_ingredient_icon.svg";
import { CTAButton } from "@/components/CTAButton";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { PickIngredientIconBottomSheet } from "@/components/PickIngredientIconBottomSheet";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { IngredientCategorySelector } from "./components/IngredientCategorySelector";
import { IngredientNameInput } from "./components/IngredientNameInput";

export default function CustomIngredientCreateScreen() {
  const { ref, open } = useDefaultBottomSheetModal();

  const [ingredientIconId, setIngredientIconId] = useState<number | null>(null);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientCategory, setIngredientCategory] = useState<number | null>(
    null
  );

  const Icon = useMemo(() => {
    if (!ingredientIconId) return null;

    return FoodDataManager.getImageSource(ingredientIconId);
  }, [ingredientIconId]);

  const onSelectIconPress = useCallback(() => {
    open();
  }, [open]);

  const onCTAButtonPress = useCallback(() => {
    console.log("create");
  }, []);

  return (
    <>
      <ScreenLayout
        title={i18n.t("custom_ingredient.create_title")}
        isScrollEnabled={true}
        footer={
          <CTAButton
            buttonLabel={i18n.t("custom_ingredient.create_title")}
            disabled={
              ingredientIconId === null ||
              ingredientName.length === 0 ||
              ingredientCategory === null
            }
            onPress={onCTAButtonPress}
            className="px-4 pb-[22px]"
          />
        }
      >
        <View className="flex-1 px-4 py-3">
          <PressableScale onPress={onSelectIconPress}>
            {ingredientIconId ? (
              <View className="w-[100px] h-[100px] self-center">
                {Icon && <Icon width={100} height={100} />}
              </View>
            ) : (
              <SelectIngredientIconImage
                width={100}
                height={100}
                style={{ alignSelf: "center" }}
              />
            )}
          </PressableScale>

          <View className="h-3" />

          <IngredientCategorySelector
            selectedCategoryId={ingredientCategory}
            onCategoryChanged={setIngredientCategory}
          />

          <View className="h-5" />

          <IngredientNameInput
            name={ingredientName}
            onNameChanged={setIngredientName}
          />
        </View>

        <PickIngredientIconBottomSheet
          bottomSheetModalRef={ref}
          onIconSelected={setIngredientIconId}
        />
      </ScreenLayout>
    </>
  );
}
