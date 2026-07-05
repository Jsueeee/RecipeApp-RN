import { DebouncedTouchableOpacity } from "@/app/components/DebouncedPressable";
import i18n from "@/lib/i18n";
import React from "react";
import { View, Text } from "react-native";
import { IngredientFridgeType } from "./RecipeIngredients";

interface Props {
  tabs: IngredientFridgeType[];
  selectedTab: IngredientFridgeType;
  onTabSelected: (tab: IngredientFridgeType) => void;
}

export const RecipeIngredientTabRow: React.FC<Props> = ({
  tabs,
  selectedTab,
  onTabSelected,
}) => {
  return (
    <View className="flex-row border-b border-gray-100 bg-white">
      {tabs.map((tab) => (
        <DebouncedTouchableOpacity
          key={tab}
          onPress={() => onTabSelected(tab)}
          className="flex-1"
        >
          <View className="items-center py-3">
            <Text
              className={`text-title5 ${
                selectedTab === tab ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {i18n.t(`recipe_detail.${tab}`)}
            </Text>
          </View>
          {selectedTab === tab && (
            <View className="h-0.5 mx-1 bg-gray-800 rounded-lg" />
          )}
        </DebouncedTouchableOpacity>
      ))}
    </View>
  );
};
