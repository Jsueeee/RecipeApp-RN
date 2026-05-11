import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const SPARKLE_VARIANTS = [
  require("@/assets/images/img_splash_sparkle_left.png"),
  require("@/assets/images/img_splash_sparkle_left_2.png"),
  require("@/assets/images/img_splash_sparkle_right.png"),
  require("@/assets/images/img_splash_sparkle_right_2.png"),
];
const SPARKLE_W = 22;
const SPARKLE_H = 28;

type Props = {
  cx: number;
  cy: number;
  count?: number;
  distance?: number;
  durationMs?: number;
  triggerKey: string | number;
  size?: number;
  lift?: number;
};

export function SparkleBurst({
  cx,
  cy,
  count = 8,
  distance = 60,
  durationMs = 750,
  triggerKey,
  size = SPARKLE_W,
  lift = 8,
}: Props) {
  const angles = Array.from({ length: count }).map((_, i) => {
    const baseAngle = (i / count) * Math.PI * 2;
    const jitter = ((i * 1.7) % 1 - 0.5) * 0.15;
    return baseAngle + jitter;
  });

  return (
    <View pointerEvents="none" style={[styles.container, { left: cx, top: cy }]}>
      {angles.map((angle, i) => (
        <Sparkle
          key={`${triggerKey}-${i}`}
          angle={angle}
          distance={distance + ((i % 3) - 1) * 8}
          delay={i * 24}
          durationMs={durationMs + (i % 2) * 80}
          variantIndex={i % SPARKLE_VARIANTS.length}
          size={size * (0.82 + (i % 4) * 0.11)}
          rotateDirection={i % 2 === 0 ? 1 : -1}
          lift={lift}
        />
      ))}
    </View>
  );
}

function Sparkle({
  angle,
  distance,
  delay,
  durationMs,
  variantIndex,
  size,
  rotateDirection,
  lift,
}: {
  angle: number;
  distance: number;
  delay: number;
  durationMs: number;
  variantIndex: number;
  size: number;
  rotateDirection: 1 | -1;
  lift: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: durationMs,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [delay, durationMs, progress]);

  const animStyle = useAnimatedStyle(() => {
    const t = progress.value;
    const tx = Math.cos(angle) * distance * t;
    const ty = Math.sin(angle) * distance * t - lift * t;
    const grow = t < 0.32 ? t / 0.32 : 1;
    const fade = t < 0.52 ? 1 : 1 - (t - 0.52) / 0.48;
    const twinkle = 0.88 + Math.sin(t * Math.PI) * 0.22;
    const scale = grow * Math.max(0, fade) * twinkle;
    return {
      transform: [
        { translateX: tx - size / 2 },
        { translateY: ty - (size * (SPARKLE_H / SPARKLE_W)) / 2 },
        { scale: Math.max(0, scale) },
        { rotate: `${rotateDirection * t * 260}deg` },
      ],
      opacity: Math.max(0, fade),
    };
  });

  return (
    <Animated.Image
      source={SPARKLE_VARIANTS[variantIndex]}
      style={[
        styles.sparkle,
        { width: size, height: size * (SPARKLE_H / SPARKLE_W) },
        animStyle,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 0,
    height: 0,
  },
  sparkle: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});
