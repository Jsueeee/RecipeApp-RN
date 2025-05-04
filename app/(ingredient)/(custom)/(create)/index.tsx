import { PressableScale } from "@/app/components/PressableScale";
import SelectIngredientIconImage from "@/assets/images/img_select_ingredient_icon.svg";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useCallback } from "react";
import { View } from "react-native";

export default function CustomIngredientCreateScreen() {
  const onSelectIconPress = useCallback(() => {
    console.log("select icon");
  }, []);

  return (
    <>
      <ScreenLayout
        title={i18n.t("custom_ingredient.create_title")}
        isScrollEnabled={true}
      >
        <View className="flex-1 px-4 py-3">
          <PressableScale onPress={onSelectIconPress}>
            <SelectIngredientIconImage
              width={100}
              height={100}
              style={{ alignSelf: "center" }}
            />
          </PressableScale>
        </View>
      </ScreenLayout>
    </>
  );
}
