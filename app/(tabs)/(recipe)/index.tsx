import { useRecipeScrapMutation } from "@/app/hooks/mutations/useRecipeScrapMutation";
import {
  usePublicRecommendedRecipesQuery,
  useRecommendedRecipesQuery,
} from "@/app/hooks/queries/useRecommendedRecipesQuery";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import { useLoginPrompt } from "@/app/hooks/useLoginPrompt";
import { getNativeAdUnitId } from "@/app/lib/ads/adUnits";
import { useGuestFridgeIngredientNamesQuery } from "@/app/lib/storage/guestFridge";
import { RecipeSummary } from "@/app/types/domain/recipe";
import { TealDotLoading } from "@/components/DotLoading";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { MainTabHeader } from "@/components/MainTabHeader";
import { NativeAdListItem } from "@/components/NativeAdListItem";
import i18n from "@/lib/i18n";
import { impactLight } from "@/app/lib/haptics";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, View } from "react-native";
import { NativeAd } from "react-native-google-mobile-ads";
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

const ItemSeparator = () => <View className="h-[1px] mx-4 bg-gray-50" />;

export default function RecipeScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStatus();
  const promptLogin = useLoginPrompt();
  const { ingredientNames, isLoading: isGuestIngredientLoading } =
    useGuestFridgeIngredientNamesQuery({ enabled: !isAuthenticated });
  const recommendedRecipesQuery = useRecommendedRecipesQuery({
    enabled: isAuthenticated,
  });
  const publicRecommendedRecipesQuery = usePublicRecommendedRecipesQuery({
    ingredientNames,
    enabled: !isAuthenticated,
  });
  const recipes = isAuthenticated
    ? recommendedRecipesQuery.recipes
    : publicRecommendedRecipesQuery.recipes;
  const totalCount = isAuthenticated
    ? recommendedRecipesQuery.totalCount
    : publicRecommendedRecipesQuery.totalCount;
  const isLoading = isAuthenticated
    ? recommendedRecipesQuery.isLoading
    : isGuestIngredientLoading || publicRecommendedRecipesQuery.isLoading;
  const fetchNextPage = isAuthenticated
    ? recommendedRecipesQuery.fetchNextPage
    : publicRecommendedRecipesQuery.fetchNextPage;
  const hasNextPage = isAuthenticated
    ? recommendedRecipesQuery.hasNextPage
    : publicRecommendedRecipesQuery.hasNextPage;

  const { addScrap, removeScrap } = useRecipeScrapMutation();

  // 리스트에 광고 아이템을 삽입하기 위한 인터벌
  const AD_INTERVAL = 4;
  // 광고 캐싱을 위한 Refs
  const adsCache = useRef<NativeAd[]>([]);
  const [adsLoadedCount, setAdsLoadedCount] = useState(0); // 리렌더링 트리거용

  // 필요한 광고 수만큼 로드
  useEffect(() => {
    if (!recipes) return;

    const adsNeeded = Math.floor(recipes.length / AD_INTERVAL);
    const currentAds = adsCache.current.length;

    if (adsNeeded > currentAds) {
      const loadAds = async () => {
        const adUnitId = getNativeAdUnitId();

        if (!adUnitId) return;

        for (let i = currentAds; i < adsNeeded; i++) {
          try {
            const ad = await NativeAd.createForAdRequest(adUnitId);
            adsCache.current.push(ad);
            setAdsLoadedCount((prev) => prev + 1);
          } catch (e) {
            console.error("Ad load failed", e);
          }
        }
      };
      loadAds();
    }
  }, [recipes?.length]);

  useEffect(() => {
    return () => {
      adsCache.current.forEach((ad) => ad.destroy());
      adsCache.current = [];
    };
  }, []);

  const onRecipeItemPress = useCallback((recipeId: number) => {
    router.push({
      pathname: "/(recipe)/(detail)",
      params: { id: recipeId },
    });
  }, []);

  const onScrapPress = useCallback(
    (recipeId: number, isScrapped: boolean) => {
      if (!isAuthenticated) {
        promptLogin();
        return;
      }

      impactLight();
      isScrapped ? removeScrap(recipeId) : addScrap(recipeId);
    },
    [addScrap, isAuthenticated, promptLogin, removeScrap],
  );

  const navigateToAddRecipe = useCallback(() => {
    router.push("/(ingredient)/(pick)");
  }, []);

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
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
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

  type ListItem =
    | { type: "recipe"; data: RecipeSummary }
    | { type: "ad"; id: string; ad?: NativeAd };

  const interleavedData: ListItem[] = useMemo(() => {
    if (!recipes || recipes.length === 0) return [];
    const result: ListItem[] = [];
    let adIndex = 0;

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      result.push({ type: "recipe", data: recipe });

      if ((i + 1) % AD_INTERVAL === 0) {
        // 캐시된 광고가 있으면 할당
        const ad = adsCache.current[adIndex];
        result.push({
          type: "ad",
          id: `ad-${adIndex}`,
          ad: ad,
        });
        adIndex++;
      }
    }
    return result;
  }, [recipes, adsLoadedCount]);

  const renderItem = useCallback(
    ({ item, index }: { item: ListItem; index: number }) => {
      if (item.type === "ad") {
        if (!item.ad) return null;

        return (
          <View
            style={{
              height: 164,
              justifyContent: "center",
              backgroundColor: "white",
            }}
          >
            <NativeAdListItem nativeAd={item.ad} />
          </View>
        );
      }

      const recipe = item.data;
      return (
        <Reanimated.View
          className={index === 0 ? "bg-background-alternative" : "bg-white"}
        >
          <LargeRecipeListItem
            recipeId={recipe.id}
            title={recipe.title}
            thumbnail={recipe.thumbnail}
            description={recipe.description}
            ingredientMatchRate={recipe.ingredientMatchRate}
            viewCount={recipe.viewCount}
            scrapCount={recipe.scrapCount}
            isScrapped={recipe.isScrapped}
            onPress={() => onRecipeItemPress(recipe.id)}
            onScrapPress={() => onScrapPress(recipe.id, recipe.isScrapped)}
            className={`bg-white ${index === 0 ? "rounded-t-[16px]" : ""}`}
          />
        </Reanimated.View>
      );
    },
    [onRecipeItemPress, onScrapPress],
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

  const ListFooterComponent = useCallback(
    () => (hasNextPage ? <TealDotLoading className="mb-20" /> : null),
    [hasNextPage],
  );

  const keyExtractor = useCallback(
    (item: ListItem) =>
      item.type === "ad" ? item.id : item.data.id.toString(),
    [],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const getItemLayout = useCallback(
    (_data: ArrayLike<ListItem> | null | undefined, index: number) => ({
      length: 164,
      offset: 164 * index,
      index,
    }),
    [],
  );

  const renderContent = () => {
    if (isAuthLoading) return <DotLoadingScreen />;
    if (isLoading) return <DotLoadingScreen />;
    if (!recipes?.length) {
      return <EmptyRecipeTabPlaceholder onPress={navigateToAddRecipe} />;
    }

    return (
      <Reanimated.FlatList<ListItem>
        data={interleavedData}
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
        extraData={adsLoadedCount}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-alternative">
      {renderContent()}

      {Boolean(recipes?.length) && (
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
            <Text className="px-4 pb-4 text-title4 mt-safe">
              {CountText()}
            </Text>
          </Reanimated.View>
        </View>
      )}
    </SafeAreaView>
  );
}
