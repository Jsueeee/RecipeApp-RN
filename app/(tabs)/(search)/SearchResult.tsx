import { useBlogRecipeScrapMutation } from "@/app/hooks/mutations/useBlogRecipeScrapMutation";
import { useRecipeScrapMutation } from "@/app/hooks/mutations/useRecipeScrapMutation";
import { useYoutubeRecipeScrapMutation } from "@/app/hooks/mutations/useYoutubeRecipeScrapMutation";
import { useSearchRecipesQuery } from "@/app/hooks/queries/useSearchRecipeQuery";
import { SearchRecipe } from "@/app/types/domain/recipe";
import { TealDotLoading } from "@/components/DotLoading";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { RecipeSourceTypeTabRow } from "@/components/RecipeSourceTypeTabRow";
import {
  RECIPE_SOURCE_TYPE,
  RecipeSourceType,
} from "@/constants/RecipeSourceType";
import i18n from "@/lib/i18n";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Linking, Text, View } from "react-native";
import SmallRecipeListItem from "../../(recipe)/components/SmallRecipeListItem";

interface Props {
  keyword: string;
  className?: string;
}

export default function SearchResult({ keyword, className }: Props) {
  const [selectedTab, setSelectedTab] = useState<RecipeSourceType>(
    RECIPE_SOURCE_TYPE.BLOG
  );

  const { addScrap: addPublicScrap, removeScrap: removePublicScrap } =
    useRecipeScrapMutation();
  const { addScrap: addBlogScrap, removeScrap: removeBlogScrap } =
    useBlogRecipeScrapMutation();
  const { addScrap: addYoutubeScrap, removeScrap: removeYoutubeScrap } =
    useYoutubeRecipeScrapMutation();

  const PAGE_SIZE = 10;

  const { recipes, totalCount, isLoading, fetchNextPage, hasNextPage } =
    useSearchRecipesQuery({
      keyword,
      size: PAGE_SIZE,
      sort: "newest",
      searchType: selectedTab,
    });

  const handleScrapButtonPress = (isScrapped: boolean, recipeId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (selectedTab) {
      case RECIPE_SOURCE_TYPE.BLOG:
        isScrapped ? removeBlogScrap(recipeId) : addBlogScrap(recipeId);
        break;
      case RECIPE_SOURCE_TYPE.YOUTUBE:
        isScrapped ? removeYoutubeScrap(recipeId) : addYoutubeScrap(recipeId);
        break;
      default:
        isScrapped ? removePublicScrap(recipeId) : addPublicScrap(recipeId);
        break;
    }
  };

  /**
   * 블로그, 유튜브 레시피 클릭 시 링크 이동
   * 추천 레시피 클릭 시 상세 페이지로 이동
   */
  const onRecipePress = useCallback(
    (recipe: SearchRecipe) => {
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
    },
    [selectedTab]
  );

  const onEndReached = useCallback(() => {
    if ((totalCount ?? 0) < PAGE_SIZE) return;

    if (hasNextPage) {
      fetchNextPage();
    }
  }, [totalCount, hasNextPage, fetchNextPage]);

  const ListFooterComponent = () => {
    if (!hasNextPage || (totalCount ?? 0) < PAGE_SIZE) return null;

    return <TealDotLoading className="mb-20" />;
  };

  const ItemSeparator = () => (
    <View className="w-full mx-4 h-[1px] bg-line-alternative" />
  );

  const renderItem = useCallback(
    ({ item }: { item: SearchRecipe }) => (
      <SmallRecipeListItem
        keyword={keyword}
        recipeId={item.recipeId}
        title={item.title}
        thumbnail={item.thumbnail}
        postUserName={item.postUserName}
        postDate={item.postDate}
        viewCount={item.viewCount}
        scrapCount={item.scrapCount}
        isScrapped={item.isScrapped}
        onScrapButtonPress={handleScrapButtonPress}
        onPress={() => onRecipePress(item)}
      />
    ),
    [keyword, handleScrapButtonPress, onRecipePress]
  );

  const keyExtractor = (item: SearchRecipe) =>
    (item.recipeId ?? item.url).toString();

  const ListHeaderComponent = useMemo(() => {
    return (
      <View className="flex-row px-4 pt-4 pb-4 items-center justify-between bg-white">
        {totalCount != null && (
          <View className="flex-row justify-center items-center gap-0.5">
            <Text className="text-title5 text-text-strong">
              {totalCount?.toLocaleString()}
            </Text>

            <Text className="text-body3 text-text-alternative">
              {i18n.t("search.result_total_count_suffix")}
            </Text>
          </View>
        )}

        {/* TODO: 정렬 선택 버튼 추가 */}
      </View>
    );
  }, [totalCount]);

  const ListEmptyComponent = () => {
    return (
      <EmptyPlaceholder
        title={i18n.t("search.result_is_empty_title")}
        description={i18n.t("search.result_is_empty_desc")}
        className="flex-1"
      />
    );
  };

  const renderContent = () => {
    if (isLoading) return <DotLoadingScreen />;

    return (
      <FlashList<SearchRecipe>
        data={recipes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEventThrottle={16}
        ListFooterComponent={ListFooterComponent}
        onEndReached={onEndReached}
        ItemSeparatorComponent={ItemSeparator}
        onEndReachedThreshold={0.5}
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        style={{ flex: 1 }}
      />
    );
  };

  return (
    <View className={`${className}`}>
      <RecipeSourceTypeTabRow
        tabs={Object.values(RECIPE_SOURCE_TYPE)}
        selectedTab={selectedTab}
        onTabSelected={setSelectedTab}
      />

      {ListHeaderComponent}

      {renderContent()}
    </View>
  );
}
