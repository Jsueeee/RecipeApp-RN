import IC_CHEVRON_LEFT from "@/assets/images/ic_chevron_left.svg";
import clsx from "clsx";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  title: string;
  backButtonIconColor?: string;
  titleColor?: string;
  rightButtonIcons?: React.ReactNode[];
  onBackClick: () => void;
  className?: string;
}

export const Header = ({
  title,
  backButtonIconColor = "#3F4542",
  titleColor = "text-strong",
  rightButtonIcons,
  onBackClick,
  className,
}: Props) => {
  return (
    <View className={clsx("w-full p-4 flex-row items-center", className)}>
      <Pressable onPress={onBackClick} className="z-10">
        <IC_CHEVRON_LEFT width={24} height={24} color={backButtonIconColor} />
      </Pressable>

      <Text
        className={`absolute left-0 right-0 text-title4 text-center ${titleColor}`}
      >
        {title}
      </Text>

      {rightButtonIcons && (
        <View className="absolute right-4">{rightButtonIcons}</View>
      )}
    </View>
  );
};
