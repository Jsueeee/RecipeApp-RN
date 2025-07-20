import { CookingTimeInput } from "@/app/(recipe)/(create)/components/CookingTimeInput";
import { useDefaultBottomSheetModal } from "@/app/hooks/useDefaultBottomSheetModal";
import { RecipeIngredientInput } from "@/app/types/api/recipe";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { AddRecipeIngredientBottomSheet } from "./components/AddRecipeIngredientBottomSheet";
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
  const [ingredients, setIngredients] = useState<RecipeIngredientInput[]>([]);

  const { ref, open, dismiss } = useDefaultBottomSheetModal();
  const initialIngredientInfo = {
    // 1개를 기본으로 가지는 재료 초기 입력 정보
    ingredientName: "",
    ingredientIconId: null,
    quantity: "1",
    unit: "",
  };
  // 재료 추가 바텀시트에서 입력 중인 재료 정보 (바텀시트 두개를 번갈아 열 때 재료 정보를 공유하기 위해)
  const [inputIngredientInfo, setInputIngredientInfo] =
    useState<RecipeIngredientInput>(initialIngredientInfo);

  const onDismissAddIngredientBottomSheet = () => {
    dismiss();
    setInputIngredientInfo(initialIngredientInfo); // 입력 정보 초기화
  };

  const onIconChanged = (iconId: number | null) => {
    setInputIngredientInfo({
      ...inputIngredientInfo,
      ingredientIconId: iconId ?? null,
    });
  };

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

  const onAddIngredientButtonPress = useCallback(() => {
    open();
  }, [open]);

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
              onAddButtonPress={onAddIngredientButtonPress}
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

      <AddRecipeIngredientBottomSheet
        bottomSheetModalRef={ref}
        openBottomSheet={open}
        onDismiss={onDismissAddIngredientBottomSheet}
        inputIngredientInfo={inputIngredientInfo}
        onInputChanged={setInputIngredientInfo}
        onIconChanged={onIconChanged}
      />
    </KeyboardAvoidingView>
  );
}
