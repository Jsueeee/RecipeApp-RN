import { PressableScale } from "@/app/components/PressableScale";
import PlusIcon from "@/assets/images/ic_plus.svg";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useCallback } from "react";
import { View } from "react-native";

export default function CustomIngredientScreen() {
  const onCreateIngredientButtonPress = useCallback(() => {
    console.log("custom");
  }, []);

  const renderRightButtons = useCallback(() => {
    return [
      <View className="flex-row gap-4">
        <PressableScale
          key="custom"
          onPress={onCreateIngredientButtonPress}
          hitSlop={4}
        >
          <PlusIcon width={24} height={24} />
        </PressableScale>
      </View>,
    ];
  }, [onCreateIngredientButtonPress]);

  return (
    <ScreenLayout
      title={i18n.t("custom_ingredient.app_bar_title")}
      rightButtonIcons={renderRightButtons()}
    >
      <View />
    </ScreenLayout>
  );
}
