import { QuantityInput } from "@/app/(fridge)/(edit)/components/EditQuantityMenu";
import { PressableScale } from "@/app/components/PressableScale";
import { useDefaultBottomSheetModal } from "@/app/hooks/useDefaultBottomSheetModal";
import { RecipeIngredientInput } from "@/app/types/api/recipe";
import SelectIngredientIconImage from "@/assets/images/img_select_ingredient_icon.svg";
import { CTAButton } from "@/components/CTAButton";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import { PickIngredientIconBottomSheet } from "@/components/PickIngredientIconBottomSheet";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  openBottomSheet: () => void;
  onDismiss: () => void;
  inputIngredientInfo: RecipeIngredientInput | null;
  onInputChanged: (ingredientInfo: RecipeIngredientInput) => void;
  onIconChanged: (iconId: number | null) => void;
}

/**
 * 재료를 추가 용 바텀시트
 */
export const AddRecipeIngredientBottomSheet = ({
  bottomSheetModalRef,
  openBottomSheet,
  onDismiss,
  inputIngredientInfo,
  onInputChanged,
  onIconChanged,
}: Props) => {
  const { ref: pickIngredientIconRef, open: openPickIngredientIcon } =
    useDefaultBottomSheetModal();

  // input 값 자음 모음 분리 현상 때문에 defaultValue 를 사용하고, inputValue, inputRef 로 관리한다
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(
    inputIngredientInfo?.ingredientName
  );
  const unitRef = useRef<TextInput>(null);
  const [unitValue, setUnitValue] = useState(inputIngredientInfo?.unit);

  const [quantity, setQuantity] = useState(
    Number(inputIngredientInfo?.quantity)
  );

  const Icon = useMemo(() => {
    if (!inputIngredientInfo?.ingredientIconId) return null;

    return FoodDataManager.getImageSource(inputIngredientInfo.ingredientIconId);
  }, [inputIngredientInfo?.ingredientIconId]);

  const onSelectIconPress = useCallback(async () => {
    // 아이콘 선택 버튼 클릭하면 재료 입력 바텀시트 내용물 임시 저장 후 닫기
    onInputChanged({
      ingredientName: inputValue || "",
      ingredientIconId: inputIngredientInfo?.ingredientIconId || null,
      quantity: quantity.toString(),
      unit: unitValue || "",
    });
    bottomSheetModalRef.current?.close(); // onDismiss 대신 단순 닫기만

    // 아이콘 선택 바텀시트 열기
    openPickIngredientIcon();
  }, [inputValue, unitValue, quantity, inputIngredientInfo?.ingredientIconId]);

  const onOpenBottomSheet = () => {
    setInputValue(inputIngredientInfo?.ingredientName);
    setUnitValue(inputIngredientInfo?.unit);
    setQuantity(Number(inputIngredientInfo?.quantity));
  };

  const onCTAButtonPress = () => {
    // 재료 추가하기
  };

  const disabled = inputValue?.length === 0 || quantity <= 0;

  return (
    <>
      <DefaultBottomSheetModal
        bottomSheetModalRef={bottomSheetModalRef}
        title={i18n.t("recipe_my_create.ingredients_bottom_sheet_title")}
        onOpen={onOpenBottomSheet}
        onDismiss={onDismiss}
      >
        <View className="flex-1 px-4 pt-2">
          <PressableScale
            onPress={onSelectIconPress}
            className="w-[100px] h-[100px] self-center"
          >
            {inputIngredientInfo?.ingredientIconId ? (
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
              ref={inputRef}
              defaultValue={inputIngredientInfo?.ingredientName}
              onChangeText={setInputValue}
              className="flex-1 text-utility2 text-text-strong"
              returnKeyType="done"
              selectTextOnFocus
              editable={true}
              placeholder={i18n.t(
                "recipe_my_create.ingredients_bottom_sheet_name_hint"
              )}
              placeholderTextColor="#9FADA6"
            />
          </View>

          {/* 수량 입력 */}
          <View className="w-full flex-column">
            <View className="w-full flex-row items-center">
              <Text className="text-title5 text-text-alternative w-[100px]">
                {i18n.t("recipe_my_create.ingredients_bottom_sheet_quantity")}
              </Text>

              <QuantityInput
                quantity={quantity}
                onQuantityChanged={setQuantity}
              />
            </View>

            {quantity <= 0 && (
              <Text className="text-body3 text-strong-destructive ms-[100px]">
                {i18n.t(
                  "recipe_my_create.ingredients_bottom_sheet_quantity_error"
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
              ref={unitRef}
              defaultValue={inputIngredientInfo?.unit}
              onChangeText={setUnitValue}
              className="flex-1 text-utility2 text-text-strong"
              returnKeyType="done"
              selectTextOnFocus
              editable={true}
              placeholder={i18n.t(
                "recipe_my_create.ingredients_bottom_sheet_unit_hint"
              )}
              placeholderTextColor="#9FADA6"
            />
          </View>

          <CTAButton
            buttonLabel={i18n.t(
              "recipe_my_create.ingredients_bottom_sheet_cta"
            )}
            disabled={disabled}
            onPress={onCTAButtonPress}
            className="mt-5 mb-[22px]"
          />
        </View>
      </DefaultBottomSheetModal>

      <PickIngredientIconBottomSheet
        bottomSheetModalRef={pickIngredientIconRef}
        onIconSelected={(iconId) => {
          onIconChanged(iconId);

          // 재료 입력 바텀시트 다시 열기
          openBottomSheet();
        }}
      />
    </>
  );
};
