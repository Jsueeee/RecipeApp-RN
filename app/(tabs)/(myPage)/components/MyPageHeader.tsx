import SettingIcon from "@/assets/images/ic_setting.svg";
import { MainTabHeader } from "@/components/MainTabHeader";
import React from "react";
import { View } from "react-native";

export function MyPageHeader() {
  return (
    <View className="flex-1 flex-row justify-between">
      <MainTabHeader tab="myPage" />

      <SettingIcon
        width={24}
        height={24}
        hitSlop={8}
        style={{ marginRight: 16, alignSelf: "flex-end", marginBottom: 16 }}
      />
    </View>
  );
}
