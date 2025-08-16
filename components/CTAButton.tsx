import { PressableScale } from "@/app/components/PressableScale";
import React from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import { WhiteDotLoading } from "./DotLoading";

type ButtonVariant = "active" | "inactive" | "danger" | "cancel" | "border";

interface Props {
  buttonLabel: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  className?: string;
  onLayout?: (e: LayoutChangeEvent) => void;
  isLoading?: boolean;
}

const getButtonStyles = (variant: ButtonVariant, disabled: boolean) => {
  if (disabled) {
    variant = "inactive";
  }

  switch (variant) {
    case "active":
      return {
        backgroundColor: "bg-primary-normal",
        borderColor: "border-primary-normal",
        textColor: "text-text-inverse",
      };
    case "inactive":
      return {
        backgroundColor: "bg-primary-disable",
        borderColor: "border-primary-disable",
        textColor: "text-text-inverse",
      };
    case "danger":
      return {
        backgroundColor: "bg-static-white",
        borderColor: "border-static-white",
        textColor: "text-strong-destructive",
      };
    case "cancel":
      return {
        backgroundColor: "bg-fill-subtle",
        borderColor: "border-fill-subtle",
        textColor: "text-text-alternative",
      };
    case "border":
      return {
        backgroundColor: "bg-background-normal",
        borderColor: "border-primary-normal",
        textColor: "text-primary-normal",
      };
    default:
      return {
        backgroundColor: "bg-primary-normal",
        borderColor: "border-primary-normal",
        textColor: "text-text-inverse",
      };
  }
};

export const CTAButton = ({
  buttonLabel,
  variant = "active",
  disabled = false,
  onPress,
  icon,
  className = "",
  onLayout,
  isLoading = false,
}: Props) => {
  const styles = getButtonStyles(variant, disabled);

  return (
    <PressableScale
      disabled={disabled || isLoading}
      onPress={onPress}
      className={className}
      onLayout={onLayout}
    >
      <View
        className={`rounded-[12px] ${styles.backgroundColor} border border-1 ${styles.borderColor}`}
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
              <Text className={`text-title4 ${styles.textColor}`}>
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
