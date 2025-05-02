import { PressableScale } from "@/app/components/PressableScale";
import { RecipeDetail } from "@/app/types/domain/recipe";
import BlogIcon from "@/assets/images/ic_blog.svg";
import YoutubeIcon from "@/assets/images/ic_youtube.svg";
import React from "react";
import { LayoutChangeEvent, View } from "react-native";
import { BottomScrapButton } from "./BottomScrapButton";

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
  if (!recipeDetail) return null;

  return (
    <View className="flex-row w-full py-2 px-4 bg-white rounded-t-2xl border-t border-l border-r border-[#ECEFED] self-center gap-2">
      <PressableScale disabled={!recipeDetail} onPress={() => {}}>
        <View
          style={{ height: scrapButtonHeight, aspectRatio: 1 }}
          className="bg-fill-subtle rounded-[12px] items-center justify-center"
        >
          <YoutubeIcon width={24} height={24} />
        </View>
      </PressableScale>

      <PressableScale disabled={!recipeDetail} onPress={() => {}}>
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
