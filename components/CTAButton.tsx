import { PressableScale } from "@/app/components/PressableScale";
import React from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import { WhiteDotLoading } from "./DotLoading";

type ButtonVariant =
  | "active"
  | "inactive"
  | "danger"
  | "cancel"
  | "border"
  | "small"
  | "loading";

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

const getButtonStyles = (
  variant: ButtonVariant,
  disabled: boolean,
  isLoading: boolean
) => {
  if (disabled) {
    variant = "inactive";
  }

  if (isLoading) {
    variant = "loading";
  }

  switch (variant) {
    case "active":
      return {
        backgroundColor: "bg-primary-normal",
        borderColor: "border-primary-normal",
        textColor: "text-text-inverse",
        textStyle: "text-title5",
        verticalPadding: "py-3.5",
        horizontalPadding: "px-4",
        height: "h-[52px]",
      };
    case "inactive":
      return {
        backgroundColor: "bg-primary-disable",
        borderColor: "border-primary-disable",
        textColor: "text-text-inverse",
        textStyle: "text-title5",
        verticalPadding: "py-3.5",
        horizontalPadding: "px-4",
        height: "h-[52px]",
      };
    case "danger":
      return {
        backgroundColor: "bg-static-white",
        borderColor: "border-static-white",
        textColor: "text-strong-destructive",
        textStyle: "text-title5",
        verticalPadding: "py-3.5",
        horizontalPadding: "px-4",
        height: "h-[52px]",
      };
    case "cancel":
      return {
        backgroundColor: "bg-fill-subtle",
        borderColor: "border-fill-subtle",
        textColor: "text-text-alternative",
        textStyle: "text-title5",
        verticalPadding: "py-3.5",
        horizontalPadding: "px-4",
        height: "h-[52px]",
      };
    case "border":
      return {
        backgroundColor: "bg-background-normal",
        borderColor: "border-primary-normal",
        textColor: "text-primary-normal",
        textStyle: "text-title5",
        verticalPadding: "py-3.5",
        horizontalPadding: "px-4",
        height: "h-[52px]",
      };
    case "small":
      return {
        backgroundColor: "bg-primary-normal",
        borderColor: "border-primary-normal",
        textColor: "text-text-inverse",
        textStyle: "text-title4",
        verticalPadding: "py-2",
        horizontalPadding: "px-3",
        height: "h-[44px]",
      };
    case "loading":
      return {
        backgroundColor: "bg-primary-normal",
        borderColor: "border-primary-normal",
        textColor: "text-text-inverse",
        textStyle: "text-title5",
        verticalPadding: "py-3.5",
        horizontalPadding: "px-4",
        height: "h-[52px]",
      };
    default:
      return {
        backgroundColor: "bg-primary-normal",
        borderColor: "border-primary-normal",
        textColor: "text-text-inverse",
        textStyle: "text-title5",
        verticalPadding: "py-3.5",
        horizontalPadding: "px-4",
        height: "h-[52px]",
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
  const styles = getButtonStyles(variant, disabled, isLoading);

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
        <View
          className={`${styles.height} flex-row items-center justify-center ${styles.verticalPadding} ${styles.horizontalPadding} relative`}
        >
          {!isLoading && (
            <>
              {icon && (
                <>
                  {icon}
                  <View className="w-2" />
                </>
              )}
              <Text className={`${styles.textStyle} ${styles.textColor}`}>
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
