import { EmptyRecipeTabPlaceholder } from "@/app/(tabs)/(recipe)/components/EmptyRecipeTabPlaceholder";
import RecipeItem from "@/app/(tabs)/(recipe)/components/RecipeItem";
import { useMyRecipeListQuery } from "@/app/hooks/queries/useMyRecipeListQuery";
import { RecipeSummary } from "@/app/types/domain/recipe";
import { DotLoading } from "@/components/DotLoading";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";

export default function MyRecipeScreen() {
  const {
    data: recipeList,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useMyRecipeListQuery();

  const onRecipeItemPress = (recipeId: number) => {
    router.push({
      pathname: "/(recipe)/(detail)",
      params: { id: recipeId },
    });
  };

  const ListFooterComponent = () =>
    hasNextPage ? <DotLoading className="mb-20" /> : null;

  const ItemSeparator = () => <View className="h-[1px] mx-4 bg-gray-50" />;

  const keyExtractor = (item: RecipeSummary) => item.id.toString();

  const onEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const getItemLayout = (
    data: ArrayLike<RecipeSummary> | null | undefined,
    index: number
  ) => ({
    length: 164,
    offset: 164 * index,
    index,
  });

  const renderItem = ({
    item,
    index,
  }: {
    item: RecipeSummary;
    index: number;
  }) => (
    <View className={index === 0 ? "bg-background-alternative " : "bg-white"}>
      <RecipeItem
        item={item}
        isScrapCountShow={false}
        onPress={() => onRecipeItemPress(item.id)}
        className={`bg-white ${index === 0 ? "rounded-t-[16px]" : ""}`}
      />
    </View>
  );

  const renderContent = () => {
    if (isLoading) return <DotLoadingScreen />;

    const recipes = recipeList?.recipes;

    if (!recipes?.length) return <EmptyRecipeTabPlaceholder />;

    return (
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={ListFooterComponent}
        onEndReached={onEndReached}
        ItemSeparatorComponent={ItemSeparator}
        onEndReachedThreshold={0.5}
        className="bg-white"
        contentContainerStyle={{ paddingBottom: 24 }}
        getItemLayout={getItemLayout}
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <ScreenLayout title={i18n.t("my_page.my_recipe")}>
      {renderContent()}
    </ScreenLayout>
  );
}
