import { PressableScale } from "@/app/components/PressableScale";
import { RecipeDetail } from "@/app/types/domain/recipe";
import BlogIcon from "@/assets/images/ic_blog.svg";
import YoutubeIcon from "@/assets/images/ic_youtube.svg";
import { RECIPE_SOURCE_TYPE } from "@/constants/RecipeSourceType";
import { router } from "expo-router";
import React from "react";
import { LayoutChangeEvent, View } from "react-native";
import { BottomScrapButton } from "./BottomScrapButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  recipeDetail: RecipeDetail | undefined;
  scrapButtonHeight: number;
  onScrapLayout: (e: LayoutChangeEvent) => void;
}

export const RecipeFooter = ({
  recipeDetail,
  scrapButtonHeight,
  onScrapLayout,
}: Props) => {
  const insets = useSafeAreaInsets();

  if (!recipeDetail) return null;

  const navigateToSearchResult = (
    sourceType: keyof typeof RECIPE_SOURCE_TYPE,
  ) => {
    router.push({
      pathname: "/(search)/recipe-result",
      params: {
        keyword: recipeDetail.title,
        sourceType,
      },
    });
  };

  return (
    <View
      className="flex-row w-full py-2 px-4 bg-white rounded-t-2xl border-t border-l border-r border-[#ECEFED] self-center gap-2"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <PressableScale
        disabled={!recipeDetail}
        onPress={() => navigateToSearchResult("YOUTUBE")}
      >
        <View
          style={{ height: scrapButtonHeight, aspectRatio: 1 }}
          className="bg-fill-subtle rounded-[12px] items-center justify-center"
        >
          <YoutubeIcon width={24} height={24} />
        </View>
      </PressableScale>

      <PressableScale
        disabled={!recipeDetail}
        onPress={() => navigateToSearchResult("BLOG")}
      >
        <View
          style={{ height: scrapButtonHeight, aspectRatio: 1 }}
          className="bg-fill-subtle rounded-[12px] items-center justify-center"
        >
          <BlogIcon width={24} height={24} />
        </View>
      </PressableScale>

      <BottomScrapButton recipeDetail={recipeDetail} onLayout={onScrapLayout} />
    </View>
  );
};
