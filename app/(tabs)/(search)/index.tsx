import { PressableScale } from "@/app/components/PressableScale";
import { usePopularKeywordsQuery } from "@/app/hooks/queries/usePopularKeywordsQuery";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { MainTabHeader } from "@/components/MainTabHeader";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SearchBar } from "./components/SearchBar";
import { SearchKeywords } from "./components/SearchKeywords";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");

  const { data: popularKeywords = [] } = usePopularKeywordsQuery();

  // 예시 데이터
  const recentKeywords = [
    "김치찌개",
    "된장찌개",
    "비빔밥",
    "김치찌개",
    "된장찌개",
    "비빔밥",
    "김치찌개",
    "된장찌개",
    "비빔밥",
    "김치찌개",
    "된장찌개",
    "비빔밥",
  ];

  return (
    <ScreenLayout isShowHeader={false}>
      <MainTabHeader tab="search" />

      <View className="flex-1">
        <View className="flex-row gap-[3px] px-4">
          <SearchBar
            keyword={keyword}
            onValueChange={setKeyword}
            onSearch={() => {}}
            className="flex-1"
            onFocus={() => {
              console.log("onFocus");
              // TODO : 애니메이션
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
          recentKeywords={recentKeywords}
          popularKeywords={popularKeywords}
          onKeywordPress={(keyword) => {
            console.log("onKeywordPress", keyword);
            setKeyword(keyword);
            // TODO: 검색 실행
          }}
          onResetPress={() => {
            console.log("onResetPress");
            // TODO: 최근 검색어 전체 삭제
          }}
          onRemovePress={(keyword) => {
            console.log("onRemovePress", keyword);
            // TODO: 특정 최근 검색어 삭제
          }}
        />
      </View>
    </ScreenLayout>
  );
}
