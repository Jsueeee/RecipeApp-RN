import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  blogScrapCount: number;
  youtubeScrapCount: number;
  recipeScrapCount: number;
  className?: string;
}

const ScrapItem = ({
  title,
  count,
  onPress,
}: {
  title: string;
  count: number;
  onPress: () => void;
}) => (
  <PressableScale onPress={onPress} className="flex-1">
    <View className="gap-[2px] items-center justify-center gap-1 bg-elevation-normal rounded-[12px] px-1 py-3">
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
    console.log("all view press");
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
          onPress={() => {
            console.log("blog scrap press");
          }}
        />
        <ScrapItem
          title={i18n.t("myPage.scrap_youtube_title")}
          count={youtubeScrapCount}
          onPress={() => {
            console.log("youtube scrap press");
          }}
        />
        <ScrapItem
          title={i18n.t("myPage.scrap_recipe_title")}
          count={recipeScrapCount}
          onPress={() => {
            console.log("recipe scrap press");
          }}
        />
      </View>
    </View>
  );
}
