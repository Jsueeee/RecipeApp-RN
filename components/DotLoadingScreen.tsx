import React from "react";
import { View } from "react-native";
import { TealDotLoading } from "./DotLoading";

interface Props {
  className?: string;
}

export const DotLoadingScreen = ({ className }: Props) => {
  return (
    <View
      className={`absolute left-0 right-0 top-0 bottom-0 items-center justify-center ${className} z-10`}
    >
      <TealDotLoading />
    </View>
  );
};
