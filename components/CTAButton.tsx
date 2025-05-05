import { PressableScale } from "@/app/components/PressableScale";
import React from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import { WhiteDotLoading } from "./DotLoading";

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
  isLoading?: boolean;
}

export const CTAButton = ({
  buttonLabel,
  buttonLabelColor = "white",
  backgroundColor = "primary-normal",
  disableBackgroundColor = "bg-primary-disable",
  borderColor = undefined,
  disabled = false,
  onPress,
  icon,
  className = "",
  onLayout,
  isLoading = false,
}: Props) => {
  return (
    <PressableScale
      disabled={disabled || isLoading}
      onPress={onPress}
      className={className}
      onLayout={onLayout}
    >
      <View
        className={`rounded-[12px] ${
          disabled ? disableBackgroundColor : `bg-${backgroundColor}`
        } border border-1 ${
          borderColor ? `border-${borderColor}` : `border-${backgroundColor}`
        }`}
      >
        <View className="h-[52px] flex-row items-center justify-center py-3.5 px-4 relative">
          {!isLoading && (
            <>
              {icon && (
                <>
                  {icon}
                  <View className="w-2" />
                </>
              )}
              <Text className={`text-title4 text-${buttonLabelColor}`}>
                {buttonLabel}
              </Text>
            </>
          )}

          {isLoading && (
            <View className="absolute inset-0 items-center justify-center">
              <WhiteDotLoading />
            </View>
          )}
        </View>
      </View>
    </PressableScale>
  );
};
