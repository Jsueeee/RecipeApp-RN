import { RecipeIngredient } from "@/app/types/domain/recipe";
import React from "react";
import { View } from "react-native";
import { EmptyIngredientsPlaceholder } from "./EmptyIngredientsPlaceholder";
import { IngredientWithQuantity } from "./IngredientWithQuantity";
import { RecipeIngredientTabRow } from "./RecipeIngredientTabRow";

export enum IngredientFridgeType {
  IN_FRIDGE = "in_fridge",
  NOT_IN_FRIDGE = "not_in_fridge",
  CREATE_RECIPE = "create_recipe",
}

interface Props {
  ingredients: RecipeIngredient[];
  tabs: IngredientFridgeType[];
  selectedTab: IngredientFridgeType;
  onTabSelected: (tab: IngredientFridgeType) => void;
  className?: string;
}

export const RecipeIngredients: React.FC<Props> = ({
  ingredients,
  tabs,
  selectedTab,
  onTabSelected,
  className,
}) => {
  return (
    <View className={className}>
      <RecipeIngredientTabRow
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelected={onTabSelected}
      />

      <View className="h-6" />

      {ingredients.length === 0 ? (
        <EmptyIngredientsPlaceholder type={selectedTab} />
      ) : (
        <View>
          {ingredients
            .reduce(
              (acc, _, i) =>
                i % 4 === 0 ? [...acc, ingredients.slice(i, i + 4)] : acc,
              [] as RecipeIngredient[][]
            )
            .map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row px-4 mt-4">
                {row.map((ingredient, index) => (
                  <IngredientWithQuantity
                    key={`${ingredient.name}-${index}`}
                    item={ingredient}
                  />
                ))}
                {Array(4 - row.length)
                  .fill(0)
                  .map((_, i) => (
                    <View key={`empty-${i}`} className="flex-1" />
                  ))}
              </View>
            ))}
        </View>
      )}
    </View>
  );
};
