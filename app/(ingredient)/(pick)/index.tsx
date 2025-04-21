import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React from "react";
import { View } from "react-native";

export default function IngredientPickScreen() {
  return (
    <ScreenLayout title={i18n.t("ingredient_pick.title")}>
      <View />
    </ScreenLayout>
  );
}
