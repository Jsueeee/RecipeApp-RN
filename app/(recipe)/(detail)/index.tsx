import { useRecipeDetailQuery } from "@/app/hooks/queries/useRecipeDetailQuery";
import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import { Header } from "@/components/Header";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, LayoutChangeEvent, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MyRecipeFooter } from "./components/MyRecipeFooter";
import { RecipeDetailInfo } from "./components/RecipeDetailInfo";
import { RecipeFooter } from "./components/RecipeFooter";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { data: recipeDetail } = useRecipeDetailQuery(Number(id));

  const [scrapButtonHeight, setScrapButtonHeight] = useState<number>(0);

  const onScrapLayout = (e: LayoutChangeEvent) => {
    setScrapButtonHeight(e.nativeEvent.layout.height);
  };

  const { data: userId } = useUserInfoQuery({
    select: (userInfo) => userInfo.userId,
  });

  const isMyRecipe = userId === recipeDetail?.postUserId;

  const footer = isMyRecipe ? (
    <MyRecipeFooter />
  ) : (
    <RecipeFooter
      recipeDetail={recipeDetail}
      scrapButtonHeight={scrapButtonHeight}
      onScrapLayout={onScrapLayout}
    />
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
