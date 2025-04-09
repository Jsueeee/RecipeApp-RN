import { PressableScale } from "@/app/components/PressableScale";
import { usePopularKeywordsQuery } from "@/app/hooks/queries/usePopularKeywordsQuery";
import { useRecentSearch } from "@/app/hooks/useRecentSearch";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { MainTabHeader } from "@/components/MainTabHeader";
import i18n from "@/lib/i18n";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { SearchBar } from "./components/SearchBar";
import { SearchKeywords } from "./components/SearchKeywords";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");
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

  return (
    <ScreenLayout isShowHeader={false}>
      <MainTabHeader tab="search" />

      <View className="flex-1">
        <View className="flex-row gap-[3px] px-4">
          <SearchBar
            keyword={keyword}
            onValueChange={setKeyword}
            onSearch={handleSearch}
            className="flex-1"
            onFocus={() => {
              console.log("onFocus");
            }}
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
      </View>
    </ScreenLayout>
  );
}
