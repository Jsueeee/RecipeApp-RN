import clsx from "clsx";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  buttonLabel: string;
  buttonLabelColor?: string;
  backgroundColor?: string;
  disableBackgroundColor?: string;
  disabled?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const CTAButton = ({
  buttonLabel,
  buttonLabelColor = "text-white",
  backgroundColor = "bg-primary-normal",
  disableBackgroundColor = "bg-primary-disable",
  disabled = false,
  onClick,
  icon,
  className = "",
}: Props) => {
  return (
    <Pressable
      className={clsx(
        "rounded-[12px]",
        disabled ? disableBackgroundColor : backgroundColor,
        className
      )}
      disabled={disabled}
      onPress={onClick}
    >
      <View className="flex-row items-center justify-center py-3.5">
        {icon && (
          <>
            {icon}
            <View className="w-2" />
          </>
        )}

        <Text className={clsx("text-title4", buttonLabelColor)}>
          {buttonLabel}
        </Text>
      </View>
    </Pressable>
  );
};
