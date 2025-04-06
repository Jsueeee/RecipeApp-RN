import React from "react";
import { View } from "react-native";
import { DotLoading } from "./DotLoading";

interface Props {
  className?: string;
}

export const DotLoadingScreen = ({ className }: Props) => {
  return (
    <View
      className={`absolute w-full h-full items-center justify-center ${className}`}
    >
      <DotLoading size={85} style={{ position: "absolute" }} />
    </View>
  );
};
