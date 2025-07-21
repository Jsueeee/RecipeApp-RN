import { CookingTimeInput } from "@/app/(recipe)/(create)/components/CookingTimeInput";
import { useDefaultBottomSheetModal } from "@/app/hooks/useDefaultBottomSheetModal";
import { RecipeIngredientInput } from "@/app/types/api/recipe";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { useCallback, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AddRecipeIngredientBottomSheet } from "./components/AddRecipeIngredientBottomSheet";
import {
  COOKING_LEVEL,
  CookingLevelChips,
} from "./components/CookingLevelChips";
import { CookingStepInputs } from "./components/CookingStepInputs";
import { CreateRecipeHeader } from "./components/CreateHeader";
import { IngredientsSection } from "./components/IngredientsSection";
import { PublicToggleSection } from "./components/PublicToggleSection";
import { CreateRecipeTitle } from "./components/CreateRecipeTitle";

export interface IngredientWithIndex {
  id: number; // 입력 재료에는 원래 id 가 없지만 리스트 관리를 위해 추가
  ingredient: RecipeIngredientInput;
}

export default function RecipeCreateScreen() {
  const [inputTitleValue, setInputTitleValue] = useState("");
  const [inputDescriptionValue, setInputDescriptionValue] = useState("");

  const [isPublic, setIsPublic] = useState(true);
  const [selectedCookingLevel, setSelectedCookingLevel] = useState(
    COOKING_LEVEL[1].key
  );
  const [cookingTime, setCookingTime] = useState<number | null>(null);
  const [stepInfo, setStepInfo] = useState([""]);
  const [ingredients, setIngredients] = useState<IngredientWithIndex[]>([]); // 입력이 완료된 재료들
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | null
  >(null); // 수정하려고 선택한 재료 id

  // 재료 추가 바텀시트 관련
  const { ref, open, dismiss } = useDefaultBottomSheetModal();
  // input 값 자음 모음 분리 현상 때문에 defaultValue 를 사용하고, inputValue, inputRef 로 관리한다
  const inputNameRef = useRef<TextInput>(null);
  const [inputNameValue, setInputNameValue] = useState(""); // 재료 이름 입력 값
  const inputUnitRef = useRef<TextInput>(null);
  const [inputUnitValue, setInputUnitValue] = useState(""); // 재료 단위 입력 값
  const [inputQuantity, setInputQuantity] = useState(1); // 재료 수량 입력 값
  const [inputIconId, setInputIconId] = useState<number | null>(null); // 재료 아이콘 ID

  const onInputTitleChanged = (title: string) => {
    setInputTitleValue(title);
  };

  const onInputDescriptionChanged = (description: string) => {
    setInputDescriptionValue(description);
  };

  const onDismissAddIngredientBottomSheet = () => {
    dismiss();
  };

  const onIconChanged = (iconId: number | null) => {
    setInputIconId(iconId);
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
    // 새로 재료 추가할 때 초기화 해주기
    setInputNameValue("");
    setInputUnitValue("");
    setInputQuantity(1);
    setInputIconId(null);

    open();
  }, [open]);

  const onAddIngredient = () => {
    dismiss();

    const newIngredient = {
      ingredientName: inputNameValue,
      ingredientIconId: inputIconId,
      quantity: inputQuantity.toString(),
      unit: inputUnitValue,
    };

    setIngredients((prev) => {
      if (selectedIngredientId) {
        // 재료 수정
        return prev.map((i) =>
          i.id === selectedIngredientId
            ? { ...i, ingredient: { ...i.ingredient, ...newIngredient } }
            : i
        );
      }

      // 재료 추가
      return [
        ...prev,
        {
          id: Date.now(),
          ingredient: newIngredient,
        },
      ];
    });

    setSelectedIngredientId(null);
  };

  const onDeleteIngredient = (item: IngredientWithIndex) => {
    setIngredients((prev) => prev.filter((i) => i.id !== item.id));
  };

  const onIngredientItemPress = useCallback(
    ({ id, ingredient }: IngredientWithIndex) => {
      setInputNameValue(ingredient.ingredientName);
      setInputUnitValue(ingredient.unit || "");
      setInputQuantity(Number(ingredient.quantity));
      setInputIconId(ingredient.ingredientIconId || null);
      setSelectedIngredientId(id);
      open();
    },
    [open]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenLayout isShowHeader={false} isScrollEnabled={false} footer={null}>
        <CreateRecipeHeader />

        <CreateRecipeTitle
          title={inputTitleValue}
          description={inputDescriptionValue}
          onInputTitleChanged={onInputTitleChanged}
          onInputDescriptionChanged={onInputDescriptionChanged}
        />

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
              onPress={onIngredientItemPress}
              onDeleteButtonPress={onDeleteIngredient}
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
        isEditMode={!!selectedIngredientId}
        inputNameRef={inputNameRef}
        inputNameValue={inputNameValue}
        inputUnitRef={inputUnitRef}
        inputUnitValue={inputUnitValue}
        inputQuantity={inputQuantity}
        inputIconId={inputIconId}
        onInputNameChanged={setInputNameValue}
        onInputUnitChanged={setInputUnitValue}
        onInputQuantityChanged={setInputQuantity}
        onIconChanged={onIconChanged}
        onCTAButtonPress={onAddIngredient}
      />
    </KeyboardAvoidingView>
  );
}
