import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import { View } from "react-native";

interface Props {
  size?: number;
  className?: string;
  color?: string;
}

export const TealDotLoading = ({ size = 150, className }: Props) => {
  return <DotLoading size={size} className={className} isTealColor={true} />;
};

export const WhiteDotLoading = ({ size = 150, className }: Props) => {
  return <DotLoading size={size} className={className} isTealColor={false} />;
};

const DotLoading = ({ size = 150, className = "", isTealColor = true }) => {
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
        source={
          isTealColor
            ? require("@/assets/lottie/lottie_dot_4_teal.json")
            : require("@/assets/lottie/lottie_dot_4_white.json")
        }
      />
    </View>
  );
};
