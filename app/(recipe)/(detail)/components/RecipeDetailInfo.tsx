import { RecipeDetail } from "@/app/types/domain/recipe";
import clsx from "clsx";
import { useState } from "react";
import { Text, View } from "react-native";
import { RecipeCookInfo } from "./RecipeCookInfo";
import { IngredientFridgeType, RecipeIngredients } from "./RecipeIngredients";
import { CookingSteps } from "./CookingSteps";
import { RecipeAuthorProfile } from "./RecipeAuthorProfile";

interface Props {
  recipeDetail: RecipeDetail | undefined;
  className?: string;
}

export const RecipeDetailInfo = ({ recipeDetail, className }: Props) => {
  const [selectedTab, setSelectedTab] = useState(
    IngredientFridgeType.IN_FRIDGE
  );

  const handleTabSelect = (tab: IngredientFridgeType) => {
    setSelectedTab(tab);
  };

  const selectedTabIngredients =
    recipeDetail?.ingredients?.filter(
      (ingredient) =>
        ingredient.isInFridge ===
        (selectedTab === IngredientFridgeType.IN_FRIDGE)
    ) ?? [];

  if (!recipeDetail) return null;

  return (
    <View
      className={clsx("flex-1 px-4 pt-6 rounded-t-[16px]", className)}
      style={{ transform: [{ translateY: -16 }] }}
    >
      <Text className="text-title2 text-text-strong pt-4">
        {recipeDetail.title}
      </Text>

      <Text className="text-body2 text-text-alternative mt-2">
        {recipeDetail.description}
      </Text>

      <RecipeAuthorProfile
        profileImage={recipeDetail.postUserProfileImage}
        nickname={recipeDetail.postUserName}
        className="mt-5"
      />

      <RecipeCookInfo
        scrapCount={recipeDetail.scrapCount}
        cookingTime={recipeDetail.cookingTime}
        cookingLevel={recipeDetail.level}
        className="mt-7"
      />

      <RecipeIngredients
        ingredients={selectedTabIngredients}
        tabs={[
          IngredientFridgeType.IN_FRIDGE,
          IngredientFridgeType.NOT_IN_FRIDGE,
        ]}
        selectedTab={selectedTab}
        onTabSelected={handleTabSelect}
        className="mt-10"
      />

      <CookingSteps stepInfo={recipeDetail.processes} className="mt-16" />
    </View>
  );
};
