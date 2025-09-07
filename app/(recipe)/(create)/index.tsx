import { CookingTimeInput } from "@/app/(recipe)/(create)/components/CookingTimeInput";
import { usePatchRecipeMutation } from "@/app/hooks/mutations/usePatchRecipeMutation";
import { usePostCreateRecipe } from "@/app/hooks/mutations/usePostCreateRecipe";
import { useDefaultBottomSheetModal } from "@/app/hooks/useDefaultBottomSheetModal";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { RecipeDetail, RecipeProcess } from "@/app/types/domain/recipe";
import { RecipeDraftStorage } from "@/app/utils/RecipeDraftStorage";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import i18n from "@/lib/i18n";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Platform, ScrollView, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import { AddRecipeIngredientBottomSheet } from "./components/AddRecipeIngredientBottomSheet";
import {
  COOKING_LEVEL,
  CookingLevelChips,
  mapLevelToCookingLevelLabel,
} from "./components/CookingLevelChips";
import { CookingStepInputs } from "./components/CookingStepInputs";
import { CreateRecipeHeader } from "./components/CreateHeader";
import { CreateRecipeTitle } from "./components/CreateRecipeTitle";
import { DraftMyRecipeDialog } from "./components/DraftMyRecipeDialog";
import {
  IngredientsSection,
  IngredientWithIndex,
  mapIngredientsToIngredientWithIndexes,
} from "./components/IngredientsSection";
import { PublicToggleSection } from "./components/PublicToggleSection";

export default function RecipeCreateScreen() {
  const navigation = useNavigation();
  const { editRecipeDetail: editRecipeDetailString } = useLocalSearchParams<{
    editRecipeDetail?: string;
  }>();

  // 키보드 높이 상태 추가
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 수정하기 모드로 진입했을 경우
  const editRecipeDetail = useMemo(() => {
    if (!editRecipeDetailString) return null;
    try {
      return JSON.parse(editRecipeDetailString) as RecipeDetail;
    } catch (error) {
      console.error("Failed to parse editRecipeDetail:", error);
      return null;
    }
  }, [editRecipeDetailString]);

  const [inputTitleValue, setInputTitleValue] = useState("");
  const [inputDescriptionValue, setInputDescriptionValue] = useState("");

  const [isPublic, setIsPublic] = useState(true);
  const [selectedCookingLevel, setSelectedCookingLevel] = useState(
    COOKING_LEVEL[1].key
  );
  const [cookingTime, setCookingTime] = useState<number | null>(null);
  const [stepInfo, setStepInfo] = useState([""]);
  const [ingredients, setIngredients] = useState<IngredientWithIndex[]>([]); // 입력이 완료된 재료들
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState<
    number | null
  >(null); // 수정하려고 선택한 재료 인덱스

  // 임시 저장 불러오기 다이얼로그
  const [isShowDraftDialog, setShowDraftDialog] = useState(false);

  // 재료 추가 바텀시트 관련
  const { ref, open, dismiss } = useDefaultBottomSheetModal();
  // input 값 자음 모음 분리 현상 때문에 defaultValue 를 사용하고, inputValue, inputRef 로 관리한다
  const inputNameRef = useRef<TextInput>(null);
  const [inputNameValue, setInputNameValue] = useState(""); // 재료 이름 입력 값
  const inputUnitRef = useRef<TextInput>(null);
  const [inputUnitValue, setInputUnitValue] = useState(""); // 재료 단위 입력 값
  const [inputQuantity, setInputQuantity] = useState(1); // 재료 수량 입력 값
  const [inputIconId, setInputIconId] = useState<number | null>(null); // 재료 아이콘 ID

  const { postCreateRecipe, isPostCreateRecipePending } = usePostCreateRecipe({
    onSuccess: () => {
      // 레시피 생성 성공 시 임시 저장 삭제
      RecipeDraftStorage.clearDraft();

      router.dismiss();

      Toast.success(i18n.t("recipe_my_create.success_toast"));

      router.push({
        pathname: "/(myPage)/(myRecipe)",
      });
    },
    onError: (error) => {
      Toast.error(i18n.t("recipe_my_create.error_toast"));
    },
  });

  const { patchRecipe } = usePatchRecipeMutation({
    onSuccess: async () => {
      router.dismiss();

      if (!editRecipeDetail) return;

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE.DETAIL(editRecipeDetail.id),
      });
    },
    onError: (error) => {
      Toast.error(i18n.t("recipe_my_create.error_toast"));
    },
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // 컴포넌트 마운트 시 임시 저장 또는 수정 모드 확인
  useEffect(() => {
    const checkDraft = async () => {
      if (editRecipeDetail) {
        onEditRecipeDetail();
        return;
      }

      const draftExists = await RecipeDraftStorage.hasDraft();
      if (draftExists) {
        setShowDraftDialog(true);
      }
    };
    checkDraft();
  }, [editRecipeDetailString]); // editRecipeDetail 대신 editRecipeDetailString 사용

  // 임시 저장 자동 저장 (입력값이 변경될 때마다)
  useEffect(() => {
    const saveDraft = async () => {
      if (
        inputTitleValue.trim() ||
        inputDescriptionValue.trim() ||
        ingredients.length > 0 ||
        stepInfo.some((step) => step.trim())
      ) {
        await RecipeDraftStorage.saveDraft({
          title: inputTitleValue,
          description: inputDescriptionValue,
          isPublic,
          selectedCookingLevel,
          cookingTime,
          stepInfo,
          ingredients,
        });
      }
    };

    // 디바운스 적용 (1초 후 저장)
    const timeoutId = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeoutId);
  }, [
    inputTitleValue,
    inputDescriptionValue,
    isPublic,
    selectedCookingLevel,
    cookingTime,
    stepInfo,
    ingredients,
  ]);

  // 임시 저장 복원
  const restoreDraft = async () => {
    const draft = await RecipeDraftStorage.loadDraft();
    if (draft) {
      setInputTitleValue(draft.title);
      setInputDescriptionValue(draft.description);
      setIsPublic(draft.isPublic);
      setSelectedCookingLevel(draft.selectedCookingLevel);
      setCookingTime(draft.cookingTime);
      setStepInfo(draft.stepInfo);
      setIngredients(draft.ingredients);

      Toast.success(i18n.t("recipe_my_create.draft_restored_toast"));
    }
    setShowDraftDialog(false);
  };

  // 수정 모드일 경우
  const onEditRecipeDetail = useCallback(() => {
    if (!editRecipeDetail) return;

    setInputTitleValue(editRecipeDetail.title);
    setInputDescriptionValue(editRecipeDetail.description || "");
    setIsPublic(true); // TODO : 서버에서 isHidden 값을 받아오면 수정
    setSelectedCookingLevel(
      mapLevelToCookingLevelLabel(editRecipeDetail.level)
    );
    setCookingTime(editRecipeDetail.cookingTime || null);
    setStepInfo(
      editRecipeDetail.processes?.map(
        (process: RecipeProcess) => process.description || ""
      ) || [""]
    );
    setIngredients(
      mapIngredientsToIngredientWithIndexes(editRecipeDetail.ingredients)
    );
    setIsPublic(editRecipeDetail.isHidden);
  }, [editRecipeDetail]);

  // 불러오기 x 선택했을 경우 임시 저장 삭제
  const ignoreDraft = () => {
    setShowDraftDialog(false);
    RecipeDraftStorage.clearDraft();
  };

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
      if (selectedIngredientIndex !== null) {
        // 재료 수정
        const newIngredients = [...prev];
        newIngredients[selectedIngredientIndex] = {
          ...newIngredients[selectedIngredientIndex],
          ingredient: {
            ...newIngredients[selectedIngredientIndex].ingredient,
            ...newIngredient,
          },
        };
        return newIngredients;
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

    setSelectedIngredientIndex(null);
  };

  const onDeleteIngredient = (item: IngredientWithIndex) => {
    setIngredients((prev) => prev.filter((i) => i.id !== item.id));
  };

  const onIngredientItemPress = useCallback(
    ({ id, ingredient }: IngredientWithIndex, index: number) => {
      setInputNameValue(ingredient.ingredientName);
      setInputUnitValue(ingredient.unit || "");
      setInputQuantity(Number(ingredient.quantity));
      setInputIconId(ingredient.ingredientIconId || null);
      setSelectedIngredientIndex(index);
      console.log("💗 index", index);
      open();
    },
    [open]
  );

  const onCTAButtonPress = () => {
    const recipeData = {
      title: inputTitleValue,
      introduction: inputDescriptionValue,
      level: selectedCookingLevel as "EASY" | "NORMAL" | "HARD",
      cookingTime: cookingTime || 0,
      isHidden: isPublic,
      ingredients: ingredients.map((item) => item.ingredient),
      processes: stepInfo
        .filter((step) => step.trim() !== "")
        .map((step, index) => ({
          cookingNo: index + 1,
          cookingDescription: step,
        })),
    };

    if (editRecipeDetail) {
      patchRecipe({
        params: recipeData,
        recipeId: editRecipeDetail.id,
      });
    } else {
      postCreateRecipe(recipeData);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 60,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        keyboardDismissMode="interactive"
      >
        <CreateRecipeHeader onCTAButtonPress={onCTAButtonPress} />

        <View className="flex-1 px-4">
          <CreateRecipeTitle
            title={inputTitleValue}
            description={inputDescriptionValue}
            onInputTitleChanged={onInputTitleChanged}
            onInputDescriptionChanged={onInputDescriptionChanged}
          />

          <View className="h-2" />

          <CookingTimeInput
            cookingTime={cookingTime}
            onChanged={setCookingTime}
          />

          <View className="h-2" />

          <CookingLevelChips
            cookingLevel={selectedCookingLevel}
            onChanged={setSelectedCookingLevel}
          />

          <View className="h-[60px]" />

          <IngredientsSection
            ingredients={ingredients}
            onPress={onIngredientItemPress}
            onDeleteButtonPress={onDeleteIngredient}
            onAddButtonPress={onAddIngredientButtonPress}
          />

          <View className="h-[60px]" />

          <CookingStepInputs
            stepInfo={stepInfo}
            onPlusButtonPress={onPlusButtonPress}
            onDeleteButtonPress={onDeleteButtonPress}
            onStepDescriptionChange={onStepDescriptionChange}
          />

          <View className="h-[60px]" />

          <PublicToggleSection
            isPublic={isPublic}
            onValueChange={setIsPublic}
          />
        </View>
      </ScrollView>

      <AddRecipeIngredientBottomSheet
        bottomSheetModalRef={ref}
        openBottomSheet={open}
        onDismiss={onDismissAddIngredientBottomSheet}
        isEditMode={selectedIngredientIndex !== null}
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

      <DraftMyRecipeDialog
        visible={isShowDraftDialog}
        onConfirm={restoreDraft}
        onCancel={ignoreDraft}
      />

      {isPostCreateRecipePending && <DotLoadingScreen />}
    </SafeAreaView>
  );
}
