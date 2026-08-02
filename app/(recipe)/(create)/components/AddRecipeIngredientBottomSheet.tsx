import { QuantityInput } from "@/app/(fridge)/(edit)/components/EditQuantityMenu";
import { CATEGORY_NAME_MAPPING } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { PressableScale } from "@/app/components/PressableScale";
import { CategorizedPickIngredients } from "@/app/types/domain/ingredient";
import SelectIngredientIconImage from "@/assets/images/img_select_ingredient_icon.svg";
import { CTAButton } from "@/components/CTAButton";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import { IngredientIconGrid } from "@/components/IngredientIconSectionGrid";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  InteractionManager,
  LayoutChangeEvent,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  openBottomSheet: () => void;
  onDismiss: () => void;
  isEditMode: boolean;
  inputNameRef: React.RefObject<TextInput | null>;
  inputNameValue: string;
  inputUnitRef: React.RefObject<TextInput | null>;
  inputUnitValue: string;
  inputQuantity: number;
  inputIconId: number | null;
  onInputNameChanged: (name: string) => void;
  onInputUnitChanged: (unit: string) => void;
  onInputQuantityChanged: (quantity: number) => void;
  onIconChanged: (iconId: number | null) => void;
  onCTAButtonPress: () => void;
}

/**
 * 재료를 추가 용 바텀시트
 */
export const AddRecipeIngredientBottomSheet = ({
  bottomSheetModalRef,
  openBottomSheet,
  onDismiss,
  isEditMode,
  inputNameRef,
  inputNameValue,
  inputUnitRef,
  inputUnitValue,
  inputQuantity,
  inputIconId,
  onInputNameChanged,
  onInputUnitChanged,
  onInputQuantityChanged,
  onIconChanged,
  onCTAButtonPress,
}: Props) => {
  const { width } = useWindowDimensions();
  const PAGE_WIDTH = width - 20; // DefaultBottomSheetModal marginHorizontal: 10 * 2
  const [step, setStep] = useState<"form" | "icon">("form");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [pageHeight, setPageHeight] = useState(0);
  const formScrollViewRef = useRef<BottomSheetScrollViewMethods>(null);
  const latestInputNameRef = useRef(inputNameValue);
  const latestInputUnitRef = useRef(inputUnitValue);
  const latestCTAButtonPressRef = useRef(onCTAButtonPress);
  const translateX = useSharedValue(0);

  latestInputNameRef.current = inputNameValue;
  latestInputUnitRef.current = inputUnitValue;
  latestCTAButtonPressRef.current = onCTAButtonPress;

  useEffect(() => {
    // 바텀시트 열림 애니메이션 등이 끝난 후(인터랙션 가능 시점)에 아이콘 리스트를 렌더링
    const task = InteractionManager.runAfterInteractions(() => {
      setShowIconPicker(true);
    });

    return () => task.cancel();
  }, []);

  const ingredientList = useMemo(() => {
    return Object.entries(FoodDataManager.getGroupedFoodList()).map(
      ([categoryId, ingredients]) =>
        ({
          ingredientCategoryId: Number(categoryId),
          ingredientCategoryName:
            CATEGORY_NAME_MAPPING[
              Number(categoryId) as keyof typeof CATEGORY_NAME_MAPPING
            ],
          ingredients: ingredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            ingredientName: ingredient.name,
            ingredientIconId: ingredient.iconId,
          })),
        }) as CategorizedPickIngredients,
    );
  }, []);

  const goToIconPicker = () => {
    setStep("icon");
    translateX.value = withTiming(-PAGE_WIDTH, { duration: 300 });
  };

  const backToForm = () => {
    setStep("form");
    translateX.value = withTiming(0, { duration: 300 });
  };

  const handleIconSelected = (iconId: number) => {
    onIconChanged(iconId);
    backToForm();
  };

  const handleDismiss = () => {
    onDismiss();
    // Reset after animation
    setTimeout(() => {
      setStep("form");
      translateX.value = 0;
    }, 300);
  };

  const handleOpen = () => {
    inputNameRef.current?.setNativeProps({ text: latestInputNameRef.current });
    inputUnitRef.current?.setNativeProps({ text: latestInputUnitRef.current });
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const Icon = useMemo(() => {
    if (!inputIconId) return null;

    return FoodDataManager.getImageSource(inputIconId);
  }, [inputIconId]);

  const disabled = inputNameValue?.length === 0 || inputQuantity <= 0;

  const handleCTAButtonPress = useCallback(() => {
    latestCTAButtonPressRef.current();
  }, []);

  const formFooter = useMemo(
    () => (
      <CTAButton
        buttonLabel={
          isEditMode
            ? i18n.t("recipe_my_create.ingredients_bottom_sheet_edit_cta")
            : i18n.t("recipe_my_create.ingredients_bottom_sheet_cta")
        }
        disabled={disabled}
        onPress={handleCTAButtonPress}
      />
    ),
    [disabled, handleCTAButtonPress, isEditMode],
  );

  const handleFormLayout = (event: LayoutChangeEvent) => {
    setPageHeight(event.nativeEvent.layout.height);
  };

  const handleQuantityFocus = () => {
    setTimeout(() => {
      formScrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title={
        step === "icon"
          ? i18n.t("custom_ingredient_create.select_icon")
          : isEditMode
            ? i18n.t("recipe_my_create.ingredients_bottom_sheet_edit_title")
            : i18n.t("recipe_my_create.ingredients_bottom_sheet_title")
      }
      onDismiss={handleDismiss}
      onOpen={handleOpen}
      onBack={step === "icon" ? backToForm : undefined}
      scrollEnabled={false}
      contentStyle={{ flex: 1, alignItems: "flex-start", overflow: "hidden" }}
      footer={step === "form" ? formFooter : undefined}
    >
      <View style={{ width: PAGE_WIDTH * 2, flexDirection: "row" }}>
        <Animated.View
          style={[
            { flexDirection: "row", width: PAGE_WIDTH * 2 },
            containerStyle,
          ]}
        >
          <View style={{ width: PAGE_WIDTH }} onLayout={handleFormLayout}>
            <BottomSheetScrollView
              ref={formScrollViewRef}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 96,
              }}
            >
              <View className="pt-2">
                <PressableScale
                  onPress={goToIconPicker}
                  className="w-[100px] h-[100px] self-center"
                >
                  {inputIconId ? (
                    <View className="w-[100px] h-[100px]">
                      {Icon && <Icon width={100} height={100} />}
                    </View>
                  ) : (
                    <SelectIngredientIconImage width={100} height={100} />
                  )}
                </PressableScale>

                <View className="h-3" />

                {/* 이름 입력 */}
                <View className="w-full flex-row items-center">
                  <Text className="text-title5 text-text-alternative w-[100px] py-[18px]">
                    {i18n.t("recipe_my_create.ingredients_bottom_sheet_name")}
                  </Text>

                  <BottomSheetTextInput
                    ref={inputNameRef}
                    onChangeText={onInputNameChanged}
                    className="flex-1 text-utility2 text-text-strong"
                    returnKeyType="done"
                    selectTextOnFocus
                    editable={true}
                    placeholder={i18n.t(
                      "recipe_my_create.ingredients_bottom_sheet_name_hint",
                    )}
                    placeholderTextColor="#9FADA6"
                  />
                </View>

                {/* 수량 입력 */}
                <View className="w-full flex-column">
                  <View className="w-full flex-row items-center">
                    <Text className="text-title5 text-text-alternative w-[100px]">
                      {i18n.t(
                        "recipe_my_create.ingredients_bottom_sheet_quantity",
                      )}
                    </Text>

                    <QuantityInput
                      quantity={inputQuantity}
                      onQuantityChanged={onInputQuantityChanged}
                      isBottomSheet
                      onFocus={handleQuantityFocus}
                    />
                  </View>

                  {inputQuantity <= 0 && (
                    <Text className="text-body3 text-strong-destructive ms-[100px]">
                      {i18n.t(
                        "recipe_my_create.ingredients_bottom_sheet_quantity_error",
                      )}
                    </Text>
                  )}
                </View>

                {/* 단위 입력 */}
                <View className="w-full flex-row items-center">
                  <Text className="text-title5 text-text-alternative w-[100px] py-[18px]">
                    {i18n.t("recipe_my_create.ingredients_bottom_sheet_unit")}
                  </Text>

                  <BottomSheetTextInput
                    ref={inputUnitRef}
                    onChangeText={onInputUnitChanged}
                    className="flex-1 text-utility2 text-text-strong"
                    returnKeyType="done"
                    maxLength={10}
                    selectTextOnFocus
                    editable={true}
                    placeholder={i18n.t(
                      "recipe_my_create.ingredients_bottom_sheet_unit_hint",
                    )}
                    placeholderTextColor="#9FADA6"
                  />
                </View>
              </View>
            </BottomSheetScrollView>
          </View>

          <View style={{ width: PAGE_WIDTH, height: pageHeight }}>
            {showIconPicker && (
              <IngredientIconGrid
                categorizedIngredients={ingredientList}
                onPress={handleIconSelected}
                isNameVisible={false}
              />
            )}
          </View>
        </Animated.View>
      </View>
    </DefaultBottomSheetModal>
  );
};
