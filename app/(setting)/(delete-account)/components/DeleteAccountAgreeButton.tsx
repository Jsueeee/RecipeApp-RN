import { PressableScale } from "@/app/components/PressableScale";
import { CheckBox } from "@/components/CheckBox";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { Text, View } from "react-native";

interface Props {
  isAgree: boolean;
  onPress: () => void;
}

export function DeleteAccountAgreeButton({ isAgree, onPress }: Props) {
  return (
    <View className="w-full px-4">
      <View className="flex-row items-center py-[14px]">
        <PressableScale onPress={onPress}>
          <View className="flex-row gap-2 justify-center items-center py-3">
            <CheckBox isChecked={isAgree} />

            <Text className="text-body2 text-text-normal">
              {i18n.t("delete_account.agree")}
            </Text>
          </View>
        </PressableScale>
      </View>
    </View>
  );
}
