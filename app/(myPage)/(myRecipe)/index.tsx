import LargeRecipeListItem from "@/app/(recipe)/components/LargeRecipeListItem";
import { CreateRecipeButton } from "@/app/(tabs)/(myPage)/components/CreateRecipeButton";
import { useMyRecipeListQuery } from "@/app/hooks/queries/useMyRecipeListQuery";
import { RecipeSummary } from "@/app/types/domain/recipe";
import { TealDotLoading } from "@/components/DotLoading";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function MyRecipeScreen() {
  const { recipes, isLoading, fetchNextPage, hasNextPage } =
    useMyRecipeListQuery();

  const onRecipeItemPress = (recipeId: number) => {
    router.push({
      pathname: "/(recipe)/(detail)",
      params: { id: recipeId },
    });
  };

  const ListFooterComponent = () =>
    hasNextPage ? <TealDotLoading className="mb-20" /> : null;

  const ItemSeparator = () => <View className="h-[1px] mx-4 bg-gray-50" />;

  const keyExtractor = (item: RecipeSummary) => item.id.toString();

  const onEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: RecipeSummary;
    index: number;
  }) => (
    <View className={index === 0 ? "bg-background-alternative " : "bg-white"}>
      <LargeRecipeListItem
        recipeId={item.id}
        title={item.title}
        thumbnail={item.thumbnail}
        description={item.description}
        ingredientMatchRate={item.ingredientMatchRate}
        viewCount={item.viewCount}
        scrapCount={item.scrapCount}
        isScrapped={item.isScrapped}
        isScrapCountShow={false}
        onPress={() => onRecipeItemPress(item.id)}
        className={`bg-white ${index === 0 ? "rounded-t-[16px]" : ""}`}
      />
    </View>
  );

  const renderContent = () => {
    if (isLoading) return <DotLoadingScreen />;

    if (!recipes?.length)
      return (
        <EmptyPlaceholder
          title={i18n.t("myPage.create_recipe_empty_title")}
          description={i18n.t("myPage.create_recipe_empty_desc")}
        />
      );

    return (
      <FlashList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={ListFooterComponent}
        onEndReached={onEndReached}
        ItemSeparatorComponent={ItemSeparator}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 24 }}
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <ScreenLayout title={i18n.t("my_page.my_recipe")}>
      {renderContent()}

      <CreateRecipeButton />
    </ScreenLayout>
  );
}
