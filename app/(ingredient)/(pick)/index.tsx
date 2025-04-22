import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { useIngredientsQuery } from "@/app/hooks/queries/useMyIngredientsQuery";
import { CategorizedPickIngredients } from "@/app/types/domain/ingredient";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useRef, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { CategorizedPickIngredientsWithIconGroup } from "./components/CategorizedPickIngredientsWithIconGroup";

const TABS = Object.values(FridgeTabs);

export default function IngredientPickScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const { data: ingredients } = useIngredientsQuery();

  const handleTabSelect = (index: number) => {
    setSelectedTabIndex(index);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleIngredientSelect = (ingredientId: number) => {
    setSelectedIngredients([...selectedIngredients, ingredientId]);
  };

  const handleIngredientUnselect = (ingredientId: number) => {
    setSelectedIngredients(
      selectedIngredients.filter((id) => id !== ingredientId)
    );
  };

  const renderItem = ({ item }: { item: CategorizedPickIngredients }) => (
    <CategorizedPickIngredientsWithIconGroup
      key={item.ingredientCategoryId}
      categoryName={item.ingredientCategoryName}
      ingredients={item.ingredients}
      selectedIngredients={selectedIngredients}
      onSelect={handleIngredientSelect}
      onUnselect={handleIngredientUnselect}
    />
  );

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

      <FlatList
        data={ingredients}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ gap: 20 }}
      />
    </ScreenLayout>
  );
}
