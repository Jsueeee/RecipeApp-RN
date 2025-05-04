import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { PressableScale } from "@/app/components/PressableScale";
import { useMyIngredientsQuery } from "@/app/hooks/queries/useMyIngredientsQuery";
import PlusIcon from "@/assets/images/ic_plus.svg";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

const TABS = Object.values(FridgeTabs);

export default function CustomIngredientScreen() {
  const { categorizedIngredients, isLoading } = useMyIngredientsQuery({});

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleTabSelect = useCallback((index: number) => {
    setSelectedTabIndex(index);
  }, []);

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
      <View>
        <CategoryTabs
          tabs={TABS}
          selectedTabIndex={selectedTabIndex}
          onSelectTabIndex={handleTabSelect}
          className="bg-white w-full"
        />
      </View>
    </ScreenLayout>
  );
}
