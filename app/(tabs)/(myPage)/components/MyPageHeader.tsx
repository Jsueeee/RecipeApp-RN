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
    <View className="flex-row justify-between">
      <MainTabHeader tab="myPage" />

      <PressableScale
        onPress={onSettingButtonPress}
        className="self-end mr-4 mb-4"
        style={{ paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 }}
        pressedStyle={{ backgroundColor: "#0000001A" }}
        hitSlop={8}
      >
        <SettingIcon width={24} height={24} />
      </PressableScale>
    </View>
  );
}
