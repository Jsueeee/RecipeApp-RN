import { PressableScale } from "@/app/components/PressableScale";
import { MainTabHeader } from "@/components/MainTabHeader";
import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { SearchBar } from "./components/SearchBar";
import i18n from "@/lib/i18n";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MainTabHeader tab="search" />

      <View className="flex-1 flex-row gap-[3px] px-4">
        <SearchBar
          keyword={keyword}
          onValueChange={setKeyword}
          onSearch={() => {}}
          className="flex-1"
        />

        {/* 취소 버튼 */}
        <PressableScale onPress={() => setKeyword("")} className="p-2.5">
          <Text className="text-body2 text-text-strong">
            {i18n.t("search.search_cancel")}
          </Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}
