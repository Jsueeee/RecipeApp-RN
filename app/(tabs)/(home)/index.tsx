import { CategoryTabs } from "@/app/(tabs)/(home)/components/CategoryTabs";
import { useFridgesQuery } from "@/app/hooks/queries/useFridgeQuery";
import { Ingredient } from "@/app/types/domain/fridge";
import { MainTabHeader } from "@/components/MainTabHeader";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddIngredientButton } from "./components/AddIngredientButton";
import { CategorizedIngredientsGroup } from "./components/CategorizedIngredientsGroup";
import { FridgeTabs } from "./constants/fridgeTabs";

const TABS = Object.values(FridgeTabs);

export default function HomeScreen() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const { data: fridges } = useFridgesQuery();

  const onIngredientItemClick = (ingredient: Ingredient) => {
    // TODO: 식재료 수정 화면으로 이동
    console.log("Food pressed:", ingredient);
  };

  const handleAddPress = () => {
    // TODO: 식재료 추가 화면으로 이동
    console.log("Add button pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-background-alternative">
      <View className="flex-1">
        <Stack.Screen options={{ headerShown: false }} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        >
          <MainTabHeader tab="home" />

          <CategoryTabs
            tabs={TABS}
            selectedTabIndex={selectedTabIndex}
            onSelectTabIndex={setSelectedTabIndex}
          />

          <View className="p-4">
            {fridges?.categories.map((category) => (
              <CategorizedIngredientsGroup
                key={category.categoryName}
                categoryName={category.categoryName}
                ingredients={category.ingredients}
                onIngredientItemClick={onIngredientItemClick}
              />
            ))}
          </View>
        </ScrollView>

        <AddIngredientButton onPress={handleAddPress} />
      </View>
    </SafeAreaView>
  );
}
