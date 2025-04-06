import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { MainTabHeader } from "@/components/MainTabHeader";
import React from "react";
import { View } from "react-native";

export const EmptyRecipeTab = () => {
  return (
    <View className="flex-1">
      <MainTabHeader tab="recipe" className="mt-safe" />

      <EmptyPlaceholder
        className="absolute top-0 bottom-0 left-0 right-0"
        buttonLabel="레시피 추가하기"
        onPress={() => {}}
      />
    </View>
  );
};
