import { PressableScale } from "@/app/components/PressableScale";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { MainTabHeader } from "@/components/MainTabHeader";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SearchBar } from "./components/SearchBar";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");

  return (
    <ScreenLayout isShowHeader={false}>
      <MainTabHeader tab="search" />

      <View className="flex-1 flex-row gap-[3px] px-4">
        <SearchBar
          keyword={keyword}
          onValueChange={setKeyword}
          onSearch={() => {}}
          className="flex-1"
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
    </ScreenLayout>
  );
}
