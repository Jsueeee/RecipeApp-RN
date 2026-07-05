import SearchResult from "@/app/(tabs)/(search)/SearchResult";
import { Header } from "@/components/Header";
import {
  RECIPE_SOURCE_TYPE,
  RecipeSourceType,
} from "@/constants/RecipeSourceType";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RecipeSourceTypeParam = keyof typeof RECIPE_SOURCE_TYPE;

const getStringParam = (param: string | string[] | undefined) =>
  Array.isArray(param) ? param[0] : param;

const getInitialSelectedTab = (
  sourceType: string | undefined,
): RecipeSourceType => {
  if (sourceType && sourceType in RECIPE_SOURCE_TYPE) {
    return RECIPE_SOURCE_TYPE[sourceType as RecipeSourceTypeParam];
  }

  return RECIPE_SOURCE_TYPE.BLOG;
};

export default function RecipeSearchResultScreen() {
  const params = useLocalSearchParams<{
    keyword?: string;
    sourceType?: string;
  }>();

  const keyword = getStringParam(params.keyword)?.trim() ?? "";
  const initialSelectedTab = useMemo(
    () => getInitialSelectedTab(getStringParam(params.sourceType)),
    [params.sourceType],
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title={keyword}
        titleColor="text-text-strong"
        onBackClick={() => router.back()}
      />

      <View className="flex-1 bg-white">
        <SearchResult
          keyword={keyword}
          initialSelectedTab={initialSelectedTab}
          className="flex-1 bg-white"
        />
      </View>
    </SafeAreaView>
  );
}
