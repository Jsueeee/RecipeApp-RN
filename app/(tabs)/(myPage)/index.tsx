import { ScreenLayout } from "@/components/layout/ScreenLayout";
import React from "react";
import { Text, View } from "react-native";

export default function MyPageScreen() {
  return (
    <ScreenLayout>
      <View className="flex-1 bg-background-alternative">
        <Text>MyPage</Text>
      </View>
    </ScreenLayout>
  );
}
