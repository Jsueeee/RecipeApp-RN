import { useRecipeScrapMutation } from "@/app/hooks/mutations/useRecipeScrapMutation";
import { useRecommendedRecipesQuery } from "@/app/hooks/queries/useRecommendedRecipesQuery";
import { RecipeSummary } from "@/app/types/domain/recipe";
import { TealDotLoading } from "@/components/DotLoading";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { MainTabHeader } from "@/components/MainTabHeader";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import Reanimated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import LargeRecipeListItem from "../../(recipe)/components/LargeRecipeListItem";
import { EmptyRecipeTabPlaceholder } from "./components/EmptyRecipeTabPlaceholder";
import * as Haptics from "expo-haptics";

export default function RecipeScreen() {
  const insets = useSafeAreaInsets();
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    isScrapped ? removeScrap(recipeId) : addScrap(recipeId);
  };

  const navigateToAddRecipe = () => {
    router.push("/(ingredient)/(pick)");
  };

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const FADE_DISTANCE = 48;
  const touchPoint = FADE_DISTANCE + insets.top;

  const headerBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [touchPoint, touchPoint + FADE_DISTANCE],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return { opacity };
  });

  const transparentHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, touchPoint], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { opacity };
  });

  const headerContentStyle = headerBgStyle;

  const renderItem = ({
    item,
    index,
  }: {
    item: RecipeSummary;
    index: number;
  }) => (
    <Reanimated.View
      className={index === 0 ? "bg-background-alternative" : "bg-white"}
    >
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
        onScrapPress={() => onScrapPress(item.id, item.isScrapped)}
        className={`bg-white ${index === 0 ? "rounded-t-[16px]" : ""}`}
      />
    </Reanimated.View>
  );

  const CountText = () => {
    return (
      <>
        <Text className="text-primary-strong">
          {totalCount != null ? totalCount.toString() : ""}
        </Text>

        {totalCount != null ? (
          <Text className="text-text-normal">
            {i18n.t("recipe.recipe_total_count_suffix")}
          </Text>
        ) : null}
      </>
    );
  };

  const ListHeaderComponent = useMemo(() => {
    return (
      <View className="bg-background-alternative">
        <Reanimated.View
          style={transparentHeaderStyle}
          className="flex-column pb-6"
        >
          <MainTabHeader tab="recipe" className="bg-background-alternative" />

          <Text className="px-4 pt-2 text-title4">{CountText()}</Text>
        </Reanimated.View>
      </View>
    );
  }, [totalCount]);

  const ListFooterComponent = () =>
    hasNextPage ? <TealDotLoading className="mb-20" /> : null;

  const ItemSeparator = () => <View className="h-[1px] mx-4 bg-gray-50" />;

  const keyExtractor = (item: RecipeSummary) => item.id.toString();

  const onEndReached = () => {
    if (hasNextPage) fetchNextPage();
  };

  const getItemLayout = (
    _data: ArrayLike<RecipeSummary> | null | undefined,
    index: number
  ) => ({ length: 164, offset: 164 * index, index });

  const renderContent = () => {
    if (isLoading) return <DotLoadingScreen />;
    if (!recipes?.length) {
      return <EmptyRecipeTabPlaceholder onPress={navigateToAddRecipe} />;
    }

    return (
      <Reanimated.FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        onEndReached={onEndReached}
        ItemSeparatorComponent={ItemSeparator}
        onEndReachedThreshold={0.5}
        className="bg-white"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-alternative">
      {renderContent()}

      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 top-0 justify-end"
        style={{ paddingTop: 16 }}
      >
        <Reanimated.View
          className="absolute inset-0 bg-white"
          style={headerBgStyle}
        />

        <Reanimated.View style={headerContentStyle}>
          <Text className="px-4 pb-4 text-title4 mt-safe">{CountText()}</Text>
        </Reanimated.View>
      </View>
    </SafeAreaView>
  );
}
