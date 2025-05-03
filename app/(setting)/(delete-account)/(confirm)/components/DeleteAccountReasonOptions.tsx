import { CheckBox } from "@/components/CheckBox";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const OPTION_COUNT = 6;

interface Props {
  onSelect: (option: number) => void;
}

export function DeleteAccountReasonOptions({ onSelect }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (option: number) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <View className="mt-[16px]">
      {Array.from({ length: OPTION_COUNT }, (_, i) => i + 1).map((option) => (
        <View key={option} className="flex-row items-center">
          <TouchableOpacity
            onPress={() => handleSelect(option)}
            className="flex-row items-center gap-2 py-3 flex-shrink-0"
          >
            <CheckBox isChecked={selectedOption === option} />
            <Text className="text-body2 text-text-normal">
              {i18n.t(`delete_account_confirm.option_${option}`)}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
