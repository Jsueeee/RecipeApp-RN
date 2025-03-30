import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { useFridgesQuery } from "@/app/hooks/queries/useFridgeQuery";
import { Ingredient } from "@/app/types/domain/fridge";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { MainTabHeader } from "@/components/MainTabHeader";
import { router, Stack } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddIngredientButton } from "./components/AddIngredientButton";
import { CategorizedIngredientsGroup } from "./components/CategorizedIngredientsGroup";
import { FridgeTabs } from "./constants/fridgeTabs";
import i18n from "@/lib/i18n";

const TABS = Object.values(FridgeTabs);

export default function FridgeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const { data: fridges } = useFridgesQuery();

  const onIngredientItemClick = (ingredient: Ingredient) => {
    router.push({
      pathname: "/(fridge)/(edit)",
      params: { id: ingredient.fridgeId },
    });
  };

  const handleAddPress = () => {
    // TODO: 식재료 추가 화면으로 이동
    console.log("Add button pressed");
  };

  const handleTabSelect = (index: number) => {
    setSelectedTabIndex(index);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const filteredCategories = useMemo(
    () =>
      fridges?.categories
        .filter(
          (category) =>
            selectedTabIndex === 0 ||
            category.categoryName === TABS[selectedTabIndex]
        )
        .filter((category) => category.ingredients.length > 0),
    [fridges?.categories, selectedTabIndex]
  );

  return (
    <SafeAreaView className="flex-1 bg-background-alternative">
      <View className="flex-1">
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
          />

          <View className="px-4 flex-1">
            {!filteredCategories || filteredCategories.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <EmptyPlaceholder
                  title={i18n.t("home.fridge_is_empty")}
                  description={i18n.t("home.fridge_is_empty_sub")}
                />
              </View>
            ) : (
              <View className="flex-1 pt-2">
                {filteredCategories.map((category) => (
                  <CategorizedIngredientsGroup
                    key={category.categoryName}
                    categoryName={category.categoryName}
                    ingredients={category.ingredients}
                    onIngredientItemClick={onIngredientItemClick}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <AddIngredientButton onPress={handleAddPress} />
      </View>
    </SafeAreaView>
  );
}
