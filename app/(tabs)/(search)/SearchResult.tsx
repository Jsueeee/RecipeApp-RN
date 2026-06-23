import { useBlogRecipeScrapMutation } from "@/app/hooks/mutations/useBlogRecipeScrapMutation";
import { useRecipeScrapMutation } from "@/app/hooks/mutations/useRecipeScrapMutation";
import { useYoutubeRecipeScrapMutation } from "@/app/hooks/mutations/useYoutubeRecipeScrapMutation";
import { useSearchRecipesQuery } from "@/app/hooks/queries/useSearchRecipeQuery";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import { useLoginPrompt } from "@/app/hooks/useLoginPrompt";
import { getNativeAdUnitId } from "@/app/lib/ads/adUnits";
import { TutorialAnchor } from "@/app/tutorial";
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
import { impactLight } from "@/app/lib/haptics";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  default as React,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Linking, Text, View } from "react-native";
import { NativeAd } from "react-native-google-mobile-ads";
import SmallRecipeListItem from "../../(recipe)/components/SmallRecipeListItem";
import { NativeAdListItem } from "@/components/NativeAdListItem";

const ItemSeparator = () => (
  <View className="w-full h-[1px] bg-line-alternative" />
);

interface Props {
  keyword: string;
  className?: string;
}

export default function SearchResult({ keyword, className }: Props) {
  const [selectedTab, setSelectedTab] = useState<RecipeSourceType>(
    RECIPE_SOURCE_TYPE.BLOG,
  );
  const { isAuthenticated } = useAuthStatus();
  const promptLogin = useLoginPrompt();

  // 리스트에 광고 아이템을 삽입하기 위한 인터벌
  const AD_INTERVAL = 4;

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

  const handleScrapButtonPress = useCallback(
    (isScrapped: boolean, recipeId: number) => {
      if (!isAuthenticated) {
        promptLogin();
        return;
      }

      impactLight();

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
    },
    [
      selectedTab,
      removeBlogScrap,
      addBlogScrap,
      removeYoutubeScrap,
      addYoutubeScrap,
      removePublicScrap,
      addPublicScrap,
      isAuthenticated,
      promptLogin,
    ],
  );

  /**
   * 블로그, 유튜브 레시피 클릭 시 링크 이동
   * 추천 레시피 클릭 시 상세 페이지로 이동
   */
  const onRecipePress = useCallback(
    (recipe: SearchRecipe) => {
      switch (selectedTab) {
        case RECIPE_SOURCE_TYPE.BLOG:
          if (recipe.url) {
            WebBrowser.openBrowserAsync(recipe.url).catch((error) => {
              console.error("블로그 링크 열기 실패:", error);
            });
          }
          break;
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
    [selectedTab],
  );

  const onEndReached = useCallback(() => {
    if ((totalCount ?? 0) < PAGE_SIZE) return;

    if (hasNextPage) {
      fetchNextPage();
    }
  }, [totalCount, hasNextPage, fetchNextPage]);

  const ListFooterComponent = useCallback(() => {
    if (!hasNextPage || (totalCount ?? 0) < PAGE_SIZE) return null;
    return <TealDotLoading className="mb-20" />;
  }, [hasNextPage, totalCount]);

  type ListItem =
    | { type: "recipe"; data: SearchRecipe }
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
  }, [recipes, adsLoadedCount]); // adsLoadedCount 변경 시 리스트 갱신

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "ad") {
        // 광고 객체가 준비되었을 때만 렌더링
        if (item.ad) {
          return <NativeAdListItem nativeAd={item.ad} />;
        }

        return null;
      }
      const data = item.data;
      return (
        <SmallRecipeListItem
          key={data.recipeId}
          keyword={keyword}
          recipeId={data.recipeId}
          title={data.title}
          description={data.description ?? undefined}
          thumbnail={data.thumbnail}
          postUserName={data.postUserName}
          postDate={data.postDate}
          viewCount={data.viewCount}
          scrapCount={data.scrapCount}
          isScrapped={data.isScrapped}
          onScrapButtonPress={handleScrapButtonPress}
          onPress={() => onRecipePress(data)}
        />
      );
    },
    [keyword, handleScrapButtonPress, onRecipePress],
  );

  const keyExtractor = useCallback(
    (item: ListItem) =>
      item.type === "ad"
        ? item.id
        : (item.data.recipeId ?? item.data.url).toString(),
    [],
  );

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

  const ListEmptyComponent = useCallback(
    () => (
      <EmptyPlaceholder
        title={i18n.t("search.result_is_empty_title")}
        description={i18n.t("search.result_is_empty_desc")}
        className="flex-1"
      />
    ),
    [],
  );

  const renderContent = () => {
    if (isLoading) return <DotLoadingScreen />;

    return (
      <FlashList<ListItem>
        data={interleavedData}
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
        extraData={adsLoadedCount}
      />
    );
  };

  return (
    <View className={`${className}`}>
      <TutorialAnchor id="search-result-source-tabs">
        <RecipeSourceTypeTabRow
          tabs={Object.values(RECIPE_SOURCE_TYPE)}
          selectedTab={selectedTab}
          onTabSelected={setSelectedTab}
        />
      </TutorialAnchor>

      {ListHeaderComponent}

      {renderContent()}
    </View>
  );
}
