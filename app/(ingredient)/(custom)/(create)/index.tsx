import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React from "react";
import { View } from "react-native";

export default function CustomIngredientCreateScreen() {
  return (
    <>
      <ScreenLayout title={i18n.t("custom_ingredient.create_title")}>
        <View></View>
      </ScreenLayout>
    </>
  );
}
