import { PressableScale } from "@/app/components/PressableScale";
import { usePopularKeywordsQuery } from "@/app/hooks/queries/usePopularKeywordsQuery";
import { useRecentSearch } from "@/app/hooks/useRecentSearch";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { MainTabHeader } from "@/components/MainTabHeader";
import i18n from "@/lib/i18n";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { SearchBar } from "./components/SearchBar";
import { SearchKeywords } from "./components/SearchKeywords";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");
  const headerAnimation = useRef(new Animated.Value(1)).current;
  const searchBarAnimation = useRef(new Animated.Value(0)).current;

  const { recentSearches, addSearch, removeSearch, clearAllSearches } =
    useRecentSearch();
  const { data: popularKeywords = [] } = usePopularKeywordsQuery();

  const handleSearch = useCallback(
    (searchKeyword: string = keyword) => {
      if (searchKeyword.trim()) {
        addSearch(searchKeyword);
        // TODO: 검색 실행
      }
    },
    [addSearch]
  );

  const animateOnFocus = useCallback(() => {
    Animated.parallel([
      Animated.timing(headerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(searchBarAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateOnBlur = useCallback(() => {
    Animated.parallel([
      Animated.timing(headerAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(searchBarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenLayout isShowHeader={false}>
      <Animated.View
        style={{
          opacity: headerAnimation,
          transform: [
            {
              translateY: headerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <MainTabHeader tab="search" />
      </Animated.View>

      <Animated.View
        className="flex-1"
        style={{
          transform: [
            {
              translateY: searchBarAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -50],
              }),
            },
          ],
        }}
      >
        <View className="flex-row gap-[3px] px-4">
          <SearchBar
            keyword={keyword}
            onValueChange={setKeyword}
            onSearch={handleSearch}
            className="flex-1"
            onFocus={animateOnFocus}
            onBlur={animateOnBlur}
          />

          {/* 취소 버튼 */}
          <PressableScale
            onPress={() => setKeyword("")}
            disabled={keyword.length === 0}
            className="p-2.5"
          >
            <Text className="text-body2 text-text-strong">
              {i18n.t("search.search_cancel")}
            </Text>
          </PressableScale>
        </View>

        <SearchKeywords
          recentKeywords={recentSearches}
          popularKeywords={popularKeywords}
          onKeywordPress={(keyword) => {
            setKeyword(keyword);
            handleSearch(keyword);
          }}
          onResetPress={clearAllSearches}
          onRemovePress={removeSearch}
        />
      </Animated.View>
    </ScreenLayout>
  );
}
