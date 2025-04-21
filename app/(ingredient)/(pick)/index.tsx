import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useRef, useState } from "react";
import { ScrollView, View } from "react-native";

const TABS = Object.values(FridgeTabs);

export default function IngredientPickScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleTabSelect = (index: number) => {
    setSelectedTabIndex(index);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <ScreenLayout title={i18n.t("ingredient_pick.title")}>
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
