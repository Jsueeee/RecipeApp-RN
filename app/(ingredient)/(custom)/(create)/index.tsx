import { PressableScale } from "@/app/components/PressableScale";
import SelectIngredientIconImage from "@/assets/images/img_select_ingredient_icon.svg";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { IngredientNameInput } from "./components/IngredientNameInput";
import { IngredientCategorySelector } from "./components/IngredientCategorySelector";
import { CTAButton } from "@/components/CTAButton";

export default function CustomIngredientCreateScreen() {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientCategory, setIngredientCategory] = useState<number>(0);

  const onSelectIconPress = useCallback(() => {
    console.log("select icon");
  }, []);

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
              ingredientName.length === 0 || ingredientCategory.length === 0
            }
            onPress={onCTAButtonPress}
            className="px-4 pb-[22px]"
          />
        }
      >
        <View className="flex-1 px-4 py-3">
          <PressableScale onPress={onSelectIconPress}>
            <SelectIngredientIconImage
              width={100}
              height={100}
              style={{ alignSelf: "center" }}
            />
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
      </ScreenLayout>
    </>
  );
}
