import { useSearchRecipesQuery } from "@/app/hooks/queries/useSearchRecipeQuery";
import { RecipeSourceTypeTabRow } from "@/components/RecipeSourceTypeTabRow";
import {
  RECIPE_SOURCE_TYPE,
  RecipeSourceType,
} from "@/constants/RecipeSourceType";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import SearchRecipeItem from "./components/SearchRecipeItem";

interface Props {
  keyword: string;
}

export default function SearchResult({ keyword }: Props) {
  const [selectedTab, setSelectedTab] = useState<RecipeSourceType>(
    RECIPE_SOURCE_TYPE.PUBLIC
  );

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
    // TODO: 스크랩 API 호출
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
          />
        )}
      />
    </View>
  );
}
