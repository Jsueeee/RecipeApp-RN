import { CookingTimeInput } from "@/app/(recipe)/(create)/components/CookingTimeInput";
import { RecipeIngredientInput } from "@/app/types/api/recipe";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
  COOKING_LEVEL,
  CookingLevelChips,
} from "./components/CookingLevelChips";
import { CookingStepInputs } from "./components/CookingStepInputs";
import { CreateRecipeHeader } from "./components/CreateHeader";
import { IngredientsSection } from "./components/IngredientsSection";
import { PublicToggleSection } from "./components/PublicToggleSection";

export default function RecipeCreateScreen() {
  const [isPublic, setIsPublic] = useState(true);
  const [selectedCookingLevel, setSelectedCookingLevel] = useState(
    COOKING_LEVEL[1].key
  );
  const [cookingTime, setCookingTime] = useState<number | null>(null);
  const [stepInfo, setStepInfo] = useState([""]);
  const [ingredients, setIngredients] = useState<RecipeIngredientInput[]>([
    {
      ingredientName: "계란",
      ingredientIconId: 1,
      quantity: "1",
      unit: "개",
    },
  ]);

  const onPlusButtonPress = () => {
    setStepInfo([...stepInfo, ""]);
  };

  const onDeleteButtonPress = (stepIndex: number) => {
    const filtered = stepInfo.filter((_, idx) => idx !== stepIndex);
    setStepInfo(filtered);
  };

  const onStepDescriptionChange = (
    stepIndex: number,
    stepDescription: string
  ) => {
    const newStepInfo = [...stepInfo];
    newStepInfo[stepIndex] = stepDescription;
    setStepInfo(newStepInfo);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenLayout isShowHeader={false} isScrollEnabled={false} footer={null}>
        <CreateRecipeHeader />

        <ScrollView className="flex-1">
          <View className="p-4">
            <CookingLevelChips
              cookingLevel={selectedCookingLevel}
              onChanged={setSelectedCookingLevel}
            />

            <CookingTimeInput
              cookingTime={cookingTime}
              onChanged={setCookingTime}
            />

            <View className="h-8" />

            <IngredientsSection
              ingredients={ingredients}
              onPress={() => {}}
              onDeleteButtonPress={() => {}}
            />

            <View className="h-8" />

            <CookingStepInputs
              stepInfo={stepInfo}
              onPlusButtonPress={onPlusButtonPress}
              onDeleteButtonPress={onDeleteButtonPress}
              onStepDescriptionChange={onStepDescriptionChange}
            />

            <View className="h-8" />

            <PublicToggleSection
              isPublic={isPublic}
              onValueChange={setIsPublic}
            />
          </View>
        </ScrollView>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
