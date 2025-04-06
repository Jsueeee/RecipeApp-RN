import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface Props {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const DotLoading = ({ size = 72, style }: Props) => {
  const animation = useRef<LottieView>(null);

  return (
    <LottieView
      autoPlay
      ref={animation}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
      source={require("@/assets/lottie/lottie_loading_dot.json")}
    />
  );
};


