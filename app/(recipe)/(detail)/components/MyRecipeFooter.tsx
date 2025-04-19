import { CTAButton } from "@/components/CTAButton";
import i18n from "@/lib/i18n";
import React from "react";
import { View } from "react-native";

export const MyRecipeFooter = () => {
  const onDeleteButtonPress = () => {};

  const onEditButtonPress = () => {
    // TODO: 수정 화면으로 이동
  };

  return (
    <View className="flex-row w-full py-2 px-4 bg-white rounded-t-2xl border-t border-l border-r border-[#ECEFED] self-center max-w-[500px] gap-2">
      <CTAButton
        buttonLabel={i18n.t("recipe_detail.my_delete")}
        buttonLabelColor="strong-destructive"
        backgroundColor="white"
        onPress={onDeleteButtonPress}
        className="w-[120px]"
      />

      <CTAButton
        buttonLabel={i18n.t("recipe_detail.my_edit")}
        onPress={onEditButtonPress}
        className="flex-1"
      />
    </View>
  );
};
