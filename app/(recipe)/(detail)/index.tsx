import { useRecipeDetailQuery } from "@/app/hooks/queries/useRecipeDetailQuery";
import { CTAButton } from "@/components/CTAButton";
import { Header } from "@/components/Header";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RecipeDetailInfo } from "./components/RecipeDetailInfo";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { data: recipeDetail } = useRecipeDetailQuery(Number(id));

  const footer: React.ReactNode = (
    <View className="py-2 border">
      <CTAButton
        buttonLabel={i18n.t("recipe_detail.bottom_scrap_button")}
        onPress={() => {}}
      />
    </View>
  );

  return (
    <View className="flex-1">
      <ScreenLayout title={id as string} isShowHeader={false} footer={footer}>
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
        title={id as string}
        onBackClick={() => router.back()}
        className="absolute top-safe left-0 right-0"
      />
    </View>
  );
}
