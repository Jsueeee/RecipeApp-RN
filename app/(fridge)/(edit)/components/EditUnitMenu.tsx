import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import IC_EDIT_FOOD_MINUS from "@/assets/images/ic_edit_food_minus.svg";
import IC_EDIT_FOOD_PLUS from "@/assets/images/ic_edit_food_plus.svg";
import i18n from "@/lib/i18n";

interface Props {
  unit: string | undefined;
  onUnitChanged: (value: string) => void;
}

export function EditUnitMenu({ unit, onUnitChanged }: Props) {
  return (
    <View className="w-full flex-row items-center">
      <Text className="text-title5 text-text-alternative w-[100px] py-[18px]">
        {i18n.t("edit_food.menu_quantity")}
      </Text>

      <UnitInput unit={unit} onUnitChanged={onUnitChanged} />
    </View>
  );
}

function UnitInput({ unit, onUnitChanged }: Props) {
  return (
    <View className="flex-1 flex-row items-center justify-between rounded-full">
      <TextInput
        value={unit}
        onChangeText={onUnitChanged}
        className="flex-1 text-text-strong font-[Pretendard-Regular] text-[15px]"
        returnKeyType="done"
        selectTextOnFocus
        editable={true}
        placeholder={i18n.t("edit_food.unit_hint")}
      />
    </View>
  );
}
