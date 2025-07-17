import { QuantityInput } from "@/app/(fridge)/(edit)/components/EditQuantityMenu";
import { PressableScale } from "@/app/components/PressableScale";
import SelectIngredientIconImage from "@/assets/images/img_select_ingredient_icon.svg";
import { CTAButton } from "@/components/CTAButton";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

/**
 * 재료를 추가 용 바텀시트
 */
export const AddRecipeIngredientBottomSheet = ({
  bottomSheetModalRef,
}: Props) => {
  const [iconId, setIconId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("");

  const Icon = useMemo(() => {
    if (!iconId) return null;

    return FoodDataManager.getImageSource(iconId);
  }, [iconId]);

  const onSelectIconPress = () => {
    console.log("onSelectIconPress");
  };

  const onCTAButtonPress = () => {
    // 재료 추가하기
  };

  const disabled = name.length === 0 || quantity === 0;

  const onResetInput = () => {
    setIconId(null);
    setName("");
    setQuantity(1);
    setUnit("");
  };

  const onDismiss = () => {
    bottomSheetModalRef.current?.close();
    onResetInput();
  };

  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title={i18n.t("recipe_my_create.ingredients_bottom_sheet_title")}
      onDismiss={onDismiss}
    >
      <View className="flex-1 px-4 pt-2">
        <PressableScale
          onPress={onSelectIconPress}
          className="w-[100px] h-[100px] self-center"
        >
          {iconId ? (
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
            value={name}
            onChangeText={setName}
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
            value={unit}
            onChangeText={setUnit}
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
          buttonLabel={i18n.t("recipe_my_create.ingredients_bottom_sheet_cta")}
          disabled={disabled}
          onPress={onCTAButtonPress}
          className="mt-5 mb-[22px]"
        />
      </View>
    </DefaultBottomSheetModal>
  );
};
