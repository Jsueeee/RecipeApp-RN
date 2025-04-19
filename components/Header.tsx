import IC_CHEVRON_LEFT from "@/assets/images/ic_chevron_left.svg";
import clsx from "clsx";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  title: string;
  backButtonIconColor?: string;
  titleColor?: string;
  onBackClick: () => void;
  className?: string;
}

export const Header = ({
  title,
  backButtonIconColor: backgroundIconColor = "fill-strong",
  titleColor = "text-strong",
  onBackClick,
  className,
}: Props) => {
  return (
    <View className={clsx("w-full p-4 flex-row items-center", className)}>
      <Pressable onPress={onBackClick} className="z-10">
        <IC_CHEVRON_LEFT width={24} height={24} color={backgroundIconColor} />
      </Pressable>

      <Text className={clsx("flex-1 text-title4 text-center", titleColor)}>
        {title}
      </Text>

      {/* 이 자리에 right 버튼 추가 */}
      <View className="w-6" />
    </View>
  );
};
