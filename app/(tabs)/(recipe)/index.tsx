import { useRecipeScrapMutation } from "@/app/hooks/mutations/useRecipeScrapMutation";
import { useRecommendedRecipesQuery } from "@/app/hooks/queries/useRecommendedRecipesQuery";
import { RecipeSummary } from "@/app/types/domain/recipe";
import { TealDotLoading } from "@/components/DotLoading";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { MainTabHeader } from "@/components/MainTabHeader";
import i18n from "@/lib/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import LargeRecipeListItem from "../../(recipe)/components/LargeRecipeListItem";
import { EmptyRecipeTabPlaceholder } from "./components/EmptyRecipeTabPlaceholder";

export default function RecipeScreen() {
  const { recipes, totalCount, isLoading, fetchNextPage, hasNextPage } =
    useRecommendedRecipesQuery();

  const { addScrap, removeScrap } = useRecipeScrapMutation();

  const onRecipeItemPress = (recipeId: number) => {
    router.push({
      pathname: "/(recipe)/(detail)",
      params: { id: recipeId },
    });
  };

  const onScrapPress = (recipeId: number, isScrapped: boolean) => {
    isScrapped ? removeScrap(recipeId) : addScrap(recipeId);
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
        onPress={() => onRecipeItemPress(item.id)}
        className={`bg-white ${index === 0 ? "rounded-t-[16px]" : ""}`}
      />
    </View>
  );

  const ListHeaderComponent = useMemo(() => {
    return (
      <View className="bg-background-alternative flex-column pb-6">
        <MainTabHeader
          tab="recipe"
          className="bg-background-alternative mt-safe"
        />

        <Text className="px-4 pt-2 text-title4">
          <Text className="text-primary-strong">
            {totalCount != null ? totalCount.toString() : ""}
          </Text>

          {totalCount != null ? (
            <Text className="text-text-normal">
              {i18n.t("recipe.recipe_total_count_suffix")}
            </Text>
          ) : null}
        </Text>
      </View>
    );
  }, [totalCount]);

  const ListFooterComponent = () =>
    hasNextPage ? <TealDotLoading className="mb-20" /> : null;

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

  const renderContent = () => {
    if (isLoading) return <DotLoadingScreen />;

    if (!recipes?.length) return <EmptyRecipeTabPlaceholder />;

    return (
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
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
    <View className="flex-1 bg-background-alternative">
      {renderContent()}

      <LinearGradient
        colors={[
          "rgba(255,255,255,1)",
          "rgba(255,255,255,1)",
          "rgba(255,255,255,0)",
        ]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 70,
        }}
      />
    </View>
  );
}
