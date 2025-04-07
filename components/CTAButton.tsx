import { PressableScale } from "@/app/components/PressableScale";
import clsx from "clsx";
import React from "react";
import { Text, View } from "react-native";

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
}

export const CTAButton = ({
  buttonLabel,
  buttonLabelColor = "text-white",
  backgroundColor = "primary-normal",
  disableBackgroundColor = "bg-primary-disable",
  borderColor = undefined,
  disabled = false,
  onPress,
  icon,
  className = "",
}: Props) => {
  return (
    <PressableScale disabled={disabled} onPress={onPress} className={className}>
      <View
        className={clsx(
          "rounded-[12px]",
          disabled ? disableBackgroundColor : `bg-${backgroundColor}`,
          borderColor
            ? `border border-${borderColor}`
            : `border border-${backgroundColor}`
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
            className={clsx("text-title4 text-text-inverse", buttonLabelColor)}
          >
            {buttonLabel}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
};
