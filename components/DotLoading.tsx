import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import { View } from "react-native";

interface Props {
  size?: number;
  className?: string;
}

export const DotLoading = ({ size = 72, className }: Props) => {
  const animation = useRef<LottieView>(null);

  return (
    <View className={`w-full items-center justify-center ${className}`}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: size,
          height: size,
        }}
        source={require("@/assets/lottie/lottie_loading_dot.json")}
      />
    </View>
  );
};
