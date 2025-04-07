import { PressableScale } from "@/app/components/PressableScale";
import { useRecipeDetailQuery } from "@/app/hooks/queries/useRecipeDetailQuery";
import BlogIcon from "@/assets/images/ic_blog.svg";
import YoutubeIcon from "@/assets/images/ic_youtube.svg";
import { Header } from "@/components/Header";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomScrapButton } from "./components/BottomScrapButton";
import { RecipeDetailInfo } from "./components/RecipeDetailInfo";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { data: recipeDetail } = useRecipeDetailQuery(Number(id));

  const footer: React.ReactNode = (
    <View className="flex-row w-full py-2 px-4 bg-white rounded-t-2xl border-t border-l border-r border-[#ECEFED] self-center max-w-[500px] gap-2">
      <PressableScale disabled={!recipeDetail} onPress={() => {}}>
        <View className="w-12 h-12 bg-fill-subtle rounded-[12px] items-center justify-center">
          <YoutubeIcon width={24} height={24} />
        </View>
      </PressableScale>

      <PressableScale disabled={!recipeDetail} onPress={() => {}}>
        <View className="w-12 h-12 bg-fill-subtle rounded-[12px] items-center justify-center">
          <BlogIcon width={24} height={24} />
        </View>
      </PressableScale>

      <BottomScrapButton recipeDetail={recipeDetail} />
    </View>
  );

  return (
    <View className="flex-1">
      <ScreenLayout isShowHeader={false} footer={footer}>
        <View>
          <Image
            source={{ uri: recipeDetail?.thumbnail }}
            className="w-full aspect-square bg-gray-100"
          />

          <RecipeDetailInfo
            className="relative -top-[16px] bg-white"
            recipeDetail={recipeDetail}
          />
        </View>
      </ScreenLayout>

      <LinearGradient
        colors={[
          "rgba(255,255,255,1)",
          "rgba(255,255,255,0.8)",
          "rgba(255,255,255,0)",
        ]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: insets.top,
          height: 100,
        }}
      />

      <Header
        title={""}
        onBackClick={() => router.back()}
        className="absolute top-safe left-0 right-0"
      />
    </View>
  );
}
