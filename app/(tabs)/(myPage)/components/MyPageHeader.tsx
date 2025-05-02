import { PressableScale } from "@/app/components/PressableScale";
import SettingIcon from "@/assets/images/ic_setting.svg";
import { MainTabHeader } from "@/components/MainTabHeader";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export function MyPageHeader() {
  const router = useRouter();

  const onSettingButtonPress = () => {
    router.push("/(setting)");
  };

  return (
    <View className="flex-1 flex-row justify-between">
      <MainTabHeader tab="myPage" />

      <PressableScale
        onPress={onSettingButtonPress}
        className="self-end mr-4 mb-4"
      >
        <SettingIcon width={24} height={24} hitSlop={8} />
      </PressableScale>
    </View>
  );
}
