import { useRecipeScrapMutation } from "@/app/hooks/mutations/useRecipeScrapMutation";
import { useSearchRecipesQuery } from "@/app/hooks/queries/useSearchRecipeQuery";
import { SearchRecipe } from "@/app/types/domain/recipe";
import { DotLoading } from "@/components/DotLoading";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { RecipeSourceTypeTabRow } from "@/components/RecipeSourceTypeTabRow";
import {
  RECIPE_SOURCE_TYPE,
  RecipeSourceType,
} from "@/constants/RecipeSourceType";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Linking, Text, View } from "react-native";
import SearchRecipeItem from "./components/SearchRecipeItem";

interface Props {
  keyword: string;
}

export default function SearchResult({ keyword }: Props) {
  const [selectedTab, setSelectedTab] = useState<RecipeSourceType>(
    RECIPE_SOURCE_TYPE.PUBLIC
  );

  const { addScrap, removeScrap } = useRecipeScrapMutation();

  const PAGE_SIZE = 10;

  const {
    data: searchResult,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useSearchRecipesQuery({
    keyword,
    size: PAGE_SIZE,
    sort: "newest",
    searchType: selectedTab,
  });

  useEffect(() => {
    if (searchResult) {
      console.log(searchResult);
    }
  }, [searchResult]);

  const handleScrapButtonPress = (isScrapped: boolean, recipeId: number) => {
    isScrapped ? removeScrap(recipeId) : addScrap(recipeId);
  };

  /**
   * 블로그, 유튜브 레시피 클릭 시 링크 이동
   * 추천 레시피 클릭 시 상세 페이지로 이동
   */
  const onRecipePress = (recipe: SearchRecipe) => {
    switch (selectedTab) {
      case RECIPE_SOURCE_TYPE.BLOG:
      case RECIPE_SOURCE_TYPE.YOUTUBE:
        if (recipe.url) {
          Linking.openURL(recipe.url);
        }
        break;
      default:
        router.push(`/(recipe)/(detail)?id=${recipe.recipeId}`);
        break;
    }
  };

  const onEndReached = () => {
    if ((searchResult?.totalCnt ?? 0) < PAGE_SIZE) return;

    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const ListFooterComponent = () => {
    if (!hasNextPage || (searchResult?.totalCnt ?? 0) < PAGE_SIZE) return null;

    return <DotLoading className="mb-20" />;
  };

  const ItemSeparator = () => (
    <View className="w-full mx-4 h-[1px] bg-line-alternative" />
  );

  const renderItem = ({ item }: { item: SearchRecipe }) => (
    <SearchRecipeItem
      keyword={keyword}
      recipe={item}
      onScrapButtonPress={handleScrapButtonPress}
      onPress={() => onRecipePress(item)}
    />
  );

  const keyExtractor = (item: SearchRecipe) => item.recipeId.toString();

  const ListHeaderComponent = () => {
    return (
      <View className="flex-1 flex-row px-4 pt-5 pb-2 items-center justify-between">
        <View className="flex-row justify-center items-center gap-0.5">
          <Text className="text-title5 text-text-strong">
            {searchResult?.totalCnt.toLocaleString()}
          </Text>

          <Text className="text-body3 text-text-alternative">
            {i18n.t("search.result_total_count_suffix")}
          </Text>
        </View>

        {/* TODO: 정렬 선택 버튼 추가 */}
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading) return <DotLoadingScreen />;

    const recipes = searchResult?.recipes;

    if (!recipes?.length) {
      return (
        <EmptyPlaceholder
          title={i18n.t("search.result_is_empty_title")}
          description={i18n.t("search.result_is_empty_desc")}
        />
      );
    }

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
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View className="flex-1">
      <RecipeSourceTypeTabRow
        tabs={Object.values(RECIPE_SOURCE_TYPE)}
        selectedTab={selectedTab}
        onTabSelected={setSelectedTab}
      />

      {renderContent()}
    </View>
  );
}
