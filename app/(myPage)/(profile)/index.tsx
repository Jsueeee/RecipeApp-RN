import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

export default function MyProfileScreen() {
  return (
    <ScreenLayout
      title={i18n.t("profile.title")}
      backgroundColor="background-alternative"
    >
      <View className="flex-1 items-center justify-center">
        <Text>My Profile</Text>
      </View>
    </ScreenLayout>
  );
}
