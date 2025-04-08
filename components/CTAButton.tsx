import { PressableScale } from "@/app/components/PressableScale";
import clsx from "clsx";
import React from "react";
import { LayoutChangeEvent, Text, View } from "react-native";

interface Props {
  buttonLabel: string;
  buttonLabelColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  disableBackgroundColor?: string;
  disabled?: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  className?: string;
  onLayout?: (e: LayoutChangeEvent) => void;
}

export const CTAButton = ({
  buttonLabel,
  buttonLabelColor = "text-inverse",
  backgroundColor = "primary-normal",
  disableBackgroundColor = "bg-primary-disable",
  borderColor = undefined,
  disabled = false,
  onPress,
  icon,
  className = "",
  onLayout,
}: Props) => {
  return (
    <PressableScale
      disabled={disabled}
      onPress={onPress}
      className={className}
      onLayout={onLayout}
    >
      <View
        className={clsx(
          "rounded-[12px]",
          disabled ? disableBackgroundColor : `bg-${backgroundColor}`,
          clsx("border", {
            [`border-${borderColor}`]: borderColor,
            [`border-${backgroundColor}`]: !borderColor,
          })
        )}
      >
        <View className="flex-row items-center justify-center py-3.5 px-4">
          {icon && (
            <>
              {icon}
              <View className="w-2" />
            </>
          )}

          <Text
            className={clsx("text-title4", {
              [`text-${buttonLabelColor}`]: buttonLabelColor,
            })}
          >
            {buttonLabel}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
};
