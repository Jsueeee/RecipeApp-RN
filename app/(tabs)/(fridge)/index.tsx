import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { useFridgesQuery } from "@/app/hooks/queries/useFridgeQuery";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import { useLoginPrompt } from "@/app/hooks/useLoginPrompt";
import { useGuestFridgesQuery } from "@/app/lib/storage/guestFridge";
import { Ingredient } from "@/app/types/domain/fridge";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { MainTabHeader } from "@/components/MainTabHeader";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
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
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStatus();
  const promptLogin = useLoginPrompt();

  const remoteFridgesQuery = useFridgesQuery({ enabled: isAuthenticated });
  const guestFridgesQuery = useGuestFridgesQuery({ enabled: !isAuthenticated });
  const fridges = isAuthenticated
    ? remoteFridgesQuery.fridges
    : guestFridgesQuery.fridges;
  const isLoading = isAuthenticated
    ? remoteFridgesQuery.isLoading
    : guestFridgesQuery.isLoading;

  const onIngredientItemClick = (ingredient: Ingredient) => {
    if (!isAuthenticated) {
      promptLogin();
      return;
    }

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
    if (isAuthLoading) {
      return <DotLoadingScreen />;
    }

    if (isLoading) {
      return <DotLoadingScreen />;
    }

    if (!filteredCategories?.length) {
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
