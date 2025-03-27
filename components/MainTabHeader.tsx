import { MainTab } from "@/app/(tabs)/MainTab";
import i18n from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  tab: MainTab;
}

const formatToKoreanDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

export function MainTabHeader({ tab }: Props) {
  return (
    <View className="px-4 py-[14px]">
      <Text className="text-body3 text-teal-600">
        {tab === "home" ? formatToKoreanDate(new Date()) : ""}
      </Text>

      <View className="flex-row justify-between items-center mt-[5px]">
        <Text className="text-title1 text-text-strong">
          {i18n.t(`header.${tab}`)}
        </Text>
      </View>
    </View>
  );
}
