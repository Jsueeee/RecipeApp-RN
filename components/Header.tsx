import React from "react";
import { View, Text, Pressable } from "react-native";
import clsx from "clsx";
import IC_CHEVRON_LEFT from "@/assets/images/ic_chevron_left.svg";

interface Props {
  title: string;
  backgroundIconColor?: string;
  titleColor?: string;
  onBackClick: () => void;
  className?: string;
}

export const Header = ({
  title,
  backgroundIconColor = "text-fill-strong",
  titleColor = "text-strong",
  onBackClick,
  className,
}: Props) => {
  return (
    <View
      className={clsx(
        "w-full p-4 flex-row items-center justify-between",
        className
      )}
    >
      <Pressable onPress={onBackClick}>
        <IC_CHEVRON_LEFT width={24} height={24} color={backgroundIconColor} />
      </Pressable>

      <Text
        className={clsx(
          "absolute left-0 right-0 text-title4 text-text-strong text-center",
          titleColor
        )}
      >
        {title}
      </Text>
    </View>
  );
};
