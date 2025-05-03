import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { useFridgesQuery } from "@/app/hooks/queries/useFridgeQuery";
import { Ingredient } from "@/app/types/domain/fridge";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { MainTabHeader } from "@/components/MainTabHeader";
import i18n from "@/lib/i18n";
import { router, Stack } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddIngredientButton } from "./components/AddIngredientButton";
import { CategorizedIngredientsGroup } from "./components/CategorizedIngredientsGroup";
import { FridgeTabs } from "./constants/fridgeTabs";

const TABS = Object.values(FridgeTabs);

export default function FridgeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const { fridges, isLoading } = useFridgesQuery();

  useEffect(() => {
    router.push("/(setting)/(delete-account)");
  }, []);

  const onIngredientItemClick = (ingredient: Ingredient) => {
    router.push({
      pathname: "/(fridge)/(edit)/[id]",
      params: { id: ingredient.fridgeId },
    });
  };

  const handleTabSelect = (index: number) => {
    setSelectedTabIndex(index);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const filteredCategories = useMemo(
    () =>
      fridges
        ?.filter(
          (category) =>
            selectedTabIndex === 0 ||
            category.categoryName === TABS[selectedTabIndex]
        )
        .filter((category) => category.ingredients.length > 0),
    [fridges, selectedTabIndex]
  );

  const renderContent = () => {
    if (isLoading) {
      return <DotLoadingScreen />;
    }

    if (filteredCategories?.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <EmptyPlaceholder
            title={i18n.t("home.fridge_is_empty")}
            description={i18n.t("home.fridge_is_empty_sub")}
          />
        </View>
      );
    }

    return (
      <View className="flex-1 pt-2">
        {filteredCategories?.map((category) => (
          <CategorizedIngredientsGroup
            key={category.categoryName}
            categoryName={category.categoryName}
            ingredients={category.ingredients}
            onIngredientItemClick={onIngredientItemClick}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-alternative">
      <View className="flex-1">
        <SystemBars style="dark" />

        <Stack.Screen options={{ headerShown: false }} />

        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        >
          <MainTabHeader tab="home" />

          <CategoryTabs
            tabs={TABS}
            selectedTabIndex={selectedTabIndex}
            onSelectTabIndex={handleTabSelect}
            className="bg-gray-100"
          />

          <View className="px-4 flex-1">{renderContent()}</View>
        </ScrollView>

        <AddIngredientButton />
      </View>
    </SafeAreaView>
  );
}
