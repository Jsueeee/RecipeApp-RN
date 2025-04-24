import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { useIngredientsQuery } from "@/app/hooks/queries/useMyIngredientsQuery";
import {
  CategorizedPickIngredients,
  PickIngredient,
} from "@/app/types/domain/ingredient";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { CategorizedPickIngredientsWithIconGroup } from "./components/CategorizedPickIngredientsWithIconGroup";
import { SelectedBottomRow } from "./components/SelectedBottomRow";

const TABS = Object.values(FridgeTabs);

export default function IngredientPickScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<
    PickIngredient[]
  >([]);
  const { data: ingredients } = useIngredientsQuery();

  const handleTabSelect = useCallback((index: number) => {
    setSelectedTabIndex(index);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const handleIngredientSelect = useCallback((ingredient: PickIngredient) => {
    setSelectedIngredients((prev) => [...prev, ingredient]);
  }, []);

  const handleIngredientUnselect = useCallback((ingredient: PickIngredient) => {
    setSelectedIngredients((prev) =>
      prev.filter((i) => i.ingredientId !== ingredient.ingredientId)
    );
  }, []);

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
    <ScreenLayout title={i18n.t("ingredient_pick.title")} edges={["top"]}>
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

      {selectedIngredients.length > 0 && (
        <SelectedBottomRow
          selectedIngredients={selectedIngredients}
          onCTAPress={() => {}}
          className="absolute bottom-0 left-0 right-0"
        />
      )}
    </ScreenLayout>
  );
}
