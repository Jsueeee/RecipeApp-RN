import { QuantityInput } from "@/app/(fridge)/(edit)/components/EditQuantityMenu";
import { PressableScale } from "@/app/components/PressableScale";
import { useDefaultBottomSheetModal } from "@/app/hooks/useDefaultBottomSheetModal";
import SelectIngredientIconImage from "@/assets/images/img_select_ingredient_icon.svg";
import { CTAButton } from "@/components/CTAButton";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import { PickIngredientIconBottomSheet } from "@/components/PickIngredientIconBottomSheet";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  openBottomSheet: () => void;
  onDismiss: () => void;
  isEditMode: boolean;
  inputNameRef: React.RefObject<TextInput>;
  inputNameValue: string;
  inputUnitRef: React.RefObject<TextInput>;
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
  const { ref: pickIngredientIconRef, open: openPickIngredientIcon } =
    useDefaultBottomSheetModal();

  const Icon = useMemo(() => {
    if (!inputIconId) return null;

    return FoodDataManager.getImageSource(inputIconId);
  }, [inputIconId]);

  const disabled = inputNameValue?.length === 0 || inputQuantity <= 0;

  return (
    <>
      <DefaultBottomSheetModal
        bottomSheetModalRef={bottomSheetModalRef}
        title={
          isEditMode
            ? i18n.t("recipe_my_create.ingredients_bottom_sheet_edit_title")
            : i18n.t("recipe_my_create.ingredients_bottom_sheet_title")
        }
        onDismiss={onDismiss}
      >
        <View className="flex-1 px-4 pt-2">
          <PressableScale
            onPress={openPickIngredientIcon}
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
              defaultValue={inputNameValue}
              onChangeText={onInputNameChanged}
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
                quantity={inputQuantity}
                onQuantityChanged={onInputQuantityChanged}
              />
            </View>

            {inputQuantity <= 0 && (
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
              ref={inputUnitRef}
              defaultValue={inputUnitValue}
              onChangeText={onInputUnitChanged}
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
            buttonLabel={
              isEditMode
                ? i18n.t("recipe_my_create.ingredients_bottom_sheet_edit_cta")
                : i18n.t("recipe_my_create.ingredients_bottom_sheet_cta")
            }
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
