import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { usePostFridgeBasketMutation } from "@/app/hooks/mutations/usePostFridgeBasketMutation";
import { useIngredientsQuery } from "@/app/hooks/queries/useMyIngredientsQuery";
import {
  CategorizedPickIngredients,
  PickIngredient,
} from "@/app/types/domain/ingredient";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
  const [shouldLoadData, setShouldLoadData] = useState(false);
  const { data: ingredients, isLoading } = useIngredientsQuery({
    enabled: shouldLoadData,
  });
  const { postFridgeBasket, isPostBasketPending } =
    usePostFridgeBasketMutation();

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

  // 화면 전환 버벅임 때문에
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        setShouldLoadData(true);
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  const filteredIngredients = useMemo(
    () =>
      ingredients
        ?.filter(
          (category) =>
            selectedTabIndex === 0 ||
            category.ingredientCategoryName === TABS[selectedTabIndex]
        )
        .filter((category) => category.ingredients.length > 0),
    [ingredients, selectedTabIndex]
  );

  const renderItem = ({ item }: { item: CategorizedPickIngredients }) => {
    if (isLoading || !shouldLoadData) {
      return null;
    }

    return (
      <CategorizedPickIngredientsWithIconGroup
        key={item.ingredientCategoryId}
        categoryName={item.ingredientCategoryName}
        ingredients={item.ingredients}
        selectedIngredients={selectedIngredients}
        onSelect={handleIngredientSelect}
        onUnselect={handleIngredientUnselect}
      />
    );
  };

  const onAddBasketButtonPress = useCallback(() => {
    postFridgeBasket({
      ingredientIds: selectedIngredients.map(
        (ingredient) => ingredient.ingredientId
      ),
    });
  }, [postFridgeBasket, selectedIngredients]);

  return (
    <>
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
          data={filteredIngredients}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ gap: 20, paddingBottom: 200 }}
        />
      </ScreenLayout>

      {selectedIngredients.length > 0 && (
        <SelectedBottomRow
          selectedIngredients={selectedIngredients}
          onRemovePress={handleIngredientUnselect}
          onCTAPress={onAddBasketButtonPress}
          isPostBasketPending={isPostBasketPending}
          className="absolute bottom-0 left-0 right-0"
        />
      )}

      {(isLoading || !shouldLoadData) && <DotLoadingScreen />}
    </>
  );
}
