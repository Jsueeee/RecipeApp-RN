import IC_CHEVRON_LEFT from "@/assets/images/ic_chevron_left.svg";
import clsx from "clsx";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  backButtonIconColor?: string;
  titleColor?: string;
  rightButtonIcons?: React.ReactNode[];
  onBackClick: () => void;
  onRightButtonClick?: () => void;
  className?: string;
}

export const Header = ({
  title,
  backButtonIconColor = "#3F4542",
  titleColor = "text-strong",
  rightButtonIcons,
  onBackClick,
  onRightButtonClick,
  className,
}: Props) => {
  return (
    <View className={clsx("w-full p-4 flex-row items-center", className)}>
      <TouchableOpacity onPress={onBackClick} className="z-10" hitSlop={10}>
        <IC_CHEVRON_LEFT width={24} height={24} color={backButtonIconColor} />
      </TouchableOpacity>

      <Text
        className={`absolute left-0 right-0 text-title4 text-center ${titleColor}`}
      >
        {title}
      </Text>

      {rightButtonIcons && (
        <TouchableOpacity
          onPress={onRightButtonClick}
          className="absolute right-4"
        >
          {rightButtonIcons}
        </TouchableOpacity>
      )}
    </View>
  );
};
