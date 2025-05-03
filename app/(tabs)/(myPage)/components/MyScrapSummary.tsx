import { PressableScale } from "@/app/components/PressableScale";
import {
  RECIPE_SOURCE_TYPE,
  RecipeSourceType,
} from "@/constants/RecipeSourceType";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
interface Props {
  blogScrapCount: number;
  youtubeScrapCount: number;
  recipeScrapCount: number;
  className?: string;
}

export const ScrapItem = ({
  title,
  count,
  onPress,
  backgroundColor = "elevation-normal",
}: {
  title: string;
  count: number;
  onPress: () => void;
  backgroundColor?: string;
}) => (
  <PressableScale onPress={onPress} className="flex-1">
    <View
      className={`bg-${backgroundColor} gap-[2px] items-center justify-center gap-1 rounded-[12px] px-1 py-3`}
    >
      <Text className="text-body4 text-text-alternative">{title}</Text>
      <Text className="text-title3 text-text-interactive">{count}</Text>
    </View>
  </PressableScale>
);

export function MyScrapSummary({
  blogScrapCount,
  youtubeScrapCount,
  recipeScrapCount,
  className,
}: Props) {
  const onAllViewPress = () => {
    router.push("/(myPage)/(scrap)");
  };

  const onScrapCountPress = (type: RecipeSourceType) => {
    router.push(`/(myPage)/(scrap)?type=${type}`);
  };

  return (
    <View className={`flex-column px-4 ${className}`}>
      <View className="flex-row items-center justify-between">
        <Text className="text-title4 text-text-strong">
          {i18n.t("myPage.scrap_title")}
        </Text>

        <PressableScale onPress={onAllViewPress}>
          <Text className="text-body3 text-text-alternative">
            {i18n.t("myPage.all_view")}
          </Text>
        </PressableScale>
      </View>

      <View className="flex-row items-center gap-2 mt-[18px]">
        <ScrapItem
          title={i18n.t("myPage.scrap_blog_title")}
          count={blogScrapCount}
          onPress={() => onScrapCountPress(RECIPE_SOURCE_TYPE.BLOG)}
        />
        <ScrapItem
          title={i18n.t("myPage.scrap_youtube_title")}
          count={youtubeScrapCount}
          onPress={() => onScrapCountPress(RECIPE_SOURCE_TYPE.YOUTUBE)}
        />
        <ScrapItem
          title={i18n.t("myPage.scrap_recipe_title")}
          count={recipeScrapCount}
          onPress={() => onScrapCountPress(RECIPE_SOURCE_TYPE.PUBLIC)}
        />
      </View>
    </View>
  );
}
