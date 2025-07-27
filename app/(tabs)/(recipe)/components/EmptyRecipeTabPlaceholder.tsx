import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { MainTabHeader } from "@/components/MainTabHeader";
import i18n from "@/lib/i18n";
import React from "react";
import { View } from "react-native";

interface Props {
  onPress: () => void;
}

export const EmptyRecipeTabPlaceholder = ({ onPress }: Props) => {
  return (
    <View className="flex-1">
      <MainTabHeader tab="recipe" className="mt-safe" />

      <EmptyPlaceholder
        className="absolute top-0 bottom-0 left-0 right-0"
        title={i18n.t("recipe.recipe_empty_title")}
        description={i18n.t("recipe.recipe_empty_desc")}
        buttonLabel={i18n.t("recipe.recipe_empty_cta")}
        onPress={onPress}
      />
    </View>
  );
};
