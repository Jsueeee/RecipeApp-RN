import SmallRecipeListItem from "@/app/(recipe)/components/SmallRecipeListItem";
import { useBlogRecipeScrapMutation } from "@/app/hooks/mutations/useBlogRecipeScrapMutation";
import { useRecipeScrapMutation } from "@/app/hooks/mutations/useRecipeScrapMutation";
import { useYoutubeRecipeScrapMutation } from "@/app/hooks/mutations/useYoutubeRecipeScrapMutation";
import { useScrapRecipesQuery } from "@/app/hooks/queries/useScrapRecipesQuery";
import { RecipeSummary } from "@/app/types/domain/recipe";
import { TealDotLoading } from "@/components/DotLoading";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { RecipeSourceTypeTabRow } from "@/components/RecipeSourceTypeTabRow";
import {
  RECIPE_SOURCE_TYPE,
  RecipeSourceType,
} from "@/constants/RecipeSourceType";
import i18n from "@/lib/i18n";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Linking, View } from "react-native";

export default function MyScrapScreen() {
  const { type } = useLocalSearchParams<{ type: RecipeSourceType }>();

  const [selectedTab, setSelectedTab] = useState<RecipeSourceType>(
    type ? (type as RecipeSourceType) : RECIPE_SOURCE_TYPE.BLOG
  );

  const {
    data: recipeList,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useScrapRecipesQuery(selectedTab);

  const { removeScrap: removePublicScrap } = useRecipeScrapMutation();
  const { removeScrap: removeBlogScrap } = useBlogRecipeScrapMutation();
  const { removeScrap: removeYoutubeScrap } = useYoutubeRecipeScrapMutation();

  const handleScrapButtonPress = (isScrapped: boolean, recipeId: number) => {
    switch (selectedTab) {
      case RECIPE_SOURCE_TYPE.BLOG:
        removeBlogScrap(recipeId);
        break;
      case RECIPE_SOURCE_TYPE.YOUTUBE:
        removeYoutubeScrap(recipeId);
        break;
      default:
        removePublicScrap(recipeId);
        break;
    }
  };

  /**
   * 블로그, 유튜브 레시피 클릭 시 링크 이동
   * 추천 레시피 클릭 시 상세 페이지로 이동
   */
  const onRecipeItemPress = (recipe: RecipeSummary) => {
    switch (selectedTab) {
      case RECIPE_SOURCE_TYPE.BLOG:
      case RECIPE_SOURCE_TYPE.YOUTUBE:
        if (recipe.linkUrl) {
          Linking.openURL(recipe.linkUrl);
        }
        break;
      default:
        router.push(`/(recipe)/(detail)?id=${recipe.id}`);
        break;
    }
  };

  const ListFooterComponent = () =>
    hasNextPage ? <TealDotLoading className="mb-20" /> : null;

  const ItemSeparator = () => (
    <View className="w-full mx-4 h-[1px] bg-line-alternative" />
  );

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
    <View className="bg-white">
      <SmallRecipeListItem
        recipeId={item.id}
        title={item.title}
        thumbnail={item.thumbnail}
        postUserName={item.postUserName ?? null}
        postDate={item.postDate}
        viewCount={item.viewCount}
        scrapCount={item.scrapCount}
        isScrapped={item.isScrapped}
        onScrapButtonPress={handleScrapButtonPress}
        onPress={() => onRecipeItemPress(item)}
      />
    </View>
  );

  const renderContent = () => {
    if (isLoading) return <DotLoadingScreen />;

    const recipes = recipeList?.recipes;

    if (!recipes?.length) {
      return (
        <EmptyPlaceholder
          title={i18n.t("my_page.scrap_list_empty_placeholder_title")}
          description={i18n.t("my_page.scrap_list_empty_placeholder_desc")}
        />
      );
    }

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
    <ScreenLayout title={i18n.t("my_page.scrap_recipe")}>
      <RecipeSourceTypeTabRow
        tabs={Object.values(RECIPE_SOURCE_TYPE)}
        selectedTab={selectedTab}
        onTabSelected={setSelectedTab}
      />

      {renderContent()}
    </ScreenLayout>
  );
}
