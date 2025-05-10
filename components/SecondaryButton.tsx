import { PressableScale } from "@/app/components/PressableScale";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  buttonLabel: string;
  onPress: () => void;
  className?: string;
}

export const SecondaryButton = ({
  buttonLabel,
  onPress,
  className = "",
}: Props) => {
  return (
    <PressableScale onPress={onPress}>
      <View
        className={`rounded-[9px] bg-primary-disable px-4 py-3 ${className}`}
      >
        <Text className="text-title5 text-primary-normal text-center">
          {buttonLabel}
        </Text>
      </View>
    </PressableScale>
  );
};
