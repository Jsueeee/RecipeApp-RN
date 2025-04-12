import { useRecipeScrapMutation } from "@/app/hooks/mutations/useRecipeScrapMutation";
import { useSearchRecipesQuery } from "@/app/hooks/queries/useSearchRecipeQuery";
import { SearchRecipe } from "@/app/types/domain/recipe";
import { RecipeSourceTypeTabRow } from "@/components/RecipeSourceTypeTabRow";
import {
  RECIPE_SOURCE_TYPE,
  RecipeSourceType,
} from "@/constants/RecipeSourceType";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Linking, View } from "react-native";
import SearchRecipeItem from "./components/SearchRecipeItem";

interface Props {
  keyword: string;
}

export default function SearchResult({ keyword }: Props) {
  const [selectedTab, setSelectedTab] = useState<RecipeSourceType>(
    RECIPE_SOURCE_TYPE.PUBLIC
  );

  const { addScrap, removeScrap } = useRecipeScrapMutation();

  const {
    data: searchResult,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useSearchRecipesQuery({
    keyword,
    size: 10,
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
  return (
    <View className="flex-1">
      <RecipeSourceTypeTabRow
        tabs={Object.values(RECIPE_SOURCE_TYPE)}
        selectedTab={selectedTab}
        onTabSelected={setSelectedTab}
      />

      <FlatList
        data={searchResult?.recipes}
        renderItem={({ item }) => (
          <SearchRecipeItem
            keyword={keyword}
            recipe={item}
            onScrapButtonPress={handleScrapButtonPress}
            onPress={() => onRecipePress(item)}
          />
        )}
        ItemSeparatorComponent={() => (
          <View className="w-full mx-4 h-[1px] bg-line-alternative" />
        )}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
    </View>
  );
}
