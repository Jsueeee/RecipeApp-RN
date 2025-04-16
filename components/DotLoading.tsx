import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import { View } from "react-native";

interface Props {
  size?: number;
  className?: string;
  color?: string;
}

export const DotLoading = ({
  size = 150,
  className,
  color = "#4BD2B0",
}: Props) => {
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
        colorFilters={[
          {
            keypath: "**",
            color: color,
          },
        ]}
        source={require("@/assets/lottie/lottie_dot_4.json")}
      />
    </View>
  );
};
