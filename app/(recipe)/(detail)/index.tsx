import { Header } from "@/components/Header";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <ScreenLayout title={id as string} isShowHeader={false}>
        <Image
          source={{ uri: "" }}
          className="w-full aspect-square bg-gray-50"
        />
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
