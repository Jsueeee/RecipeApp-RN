import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import Constants from "expo-constants";
import React from "react";
import { Text, View } from "react-native";

export default function SettingScreen() {
  const renderVersionInfo = () => {
    return (
      <View className="flex-row items-center justify-between">
        <Text className="text-utility2 text-text-strong">
          {i18n.t("setting.versionInfo")}
        </Text>
        <Text className="bg-primary-disable px-[6px] py-[3px] rounded-[6px] text-utility2 text-teal-600">
          {Constants.expoConfig?.version}
        </Text>
      </View>
    );
  };

  return (
    <ScreenLayout
      title={i18n.t("setting.title")}
      backgroundColor="background-alternative"
    >
      <View className="flex-1 px-4 py-3">
        <View className="w-full bg-white rounded-[12px] p-4">
          {renderVersionInfo()}
        </View>
      </View>
    </ScreenLayout>
  );
}
