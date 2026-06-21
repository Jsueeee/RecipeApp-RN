import IC_CRYING_ONION from "@/assets/images/ic_crying_onion.svg";
import i18n from "@/lib/i18n";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { CTAButton } from "./CTAButton";

interface Props {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onPress?: () => void;
  className?: string;
}

export function EmptyPlaceholder({
  title = i18n.t("home.fridge_is_empty"),
  description = i18n.t("home.fridge_is_empty_sub"),
  buttonLabel,
  onPress,
  className = "",
}: Props) {
  return (
    <View className={`flex-1 items-center justify-center ${className} pb-safe`}>
      <CryingOnion />

      <Text className="text-title3 text-text-strong mt-4 text-center">
        {title}
      </Text>

      <Text className="text-body2 text-text-alternative mt-2 text-center">
        {description}
      </Text>

      {buttonLabel && (
        <CTAButton
          variant="small"
          buttonLabel={buttonLabel}
          onPress={() => onPress?.()}
          className="mt-4"
        />
      )}
    </View>
  );
}

const TEAR_LOOP_MS = 1900;
const TEAR_DURATION_MS = 980;
const TEAR_DROPS = [
  { left: 44.5, top: 39, size: 7, delayMs: 0, fall: 27, drift: 1.1 },
  { left: 47.5, top: 38, size: 5, delayMs: 560, fall: 25, drift: -0.8 },
  { left: 45.5, top: 40, size: 6, delayMs: 1160, fall: 24, drift: 0.6 },
];

function CryingOnion() {
  const progress = useSharedValue(0);
  const bodyStyle = useAnimatedStyle(() => {
    const wave = Math.sin(progress.value * Math.PI * 2);
    const sniff = Math.max(0, Math.sin(progress.value * Math.PI * 2 - 0.25));

    return {
      transform: [
        { translateY: sniff * 1.3 },
        { rotate: `${wave * 1.15}deg` },
        { scale: 1 + Math.max(0, wave) * 0.018 },
      ],
    };
  });

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, {
        duration: TEAR_LOOP_MS,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [progress]);

  return (
    <View pointerEvents="none" style={styles.onion}>
      <Animated.View style={[styles.onionBody, bodyStyle]}>
        <IC_CRYING_ONION width={80} height={80} />
        <Blush />
        <View pointerEvents="none" style={styles.tearLayer}>
          {TEAR_DROPS.map((drop) => (
            <FallingTear key={drop.delayMs} progress={progress} {...drop} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function Blush() {
  return (
    <Svg
      pointerEvents="none"
      width={80}
      height={80}
      viewBox="0 0 80 80"
      style={styles.blushLayer}
    >
      <Circle cx={28.4} cy={38.6} r={3.1} fill="#FF8FA3" opacity={0.26} />
      <Circle cx={53.8} cy={38.4} r={2.8} fill="#FF8FA3" opacity={0.22} />
    </Svg>
  );
}

function FallingTear({
  progress,
  left,
  top,
  size,
  delayMs,
  fall,
  drift,
}: {
  progress: SharedValue<number>;
  left: number;
  top: number;
  size: number;
  delayMs: number;
  fall: number;
  drift: number;
}) {
  const animStyle = useAnimatedStyle(() => {
    const elapsedMs = progress.value * TEAR_LOOP_MS;
    const phaseMs = (elapsedMs - delayMs + TEAR_LOOP_MS) % TEAR_LOOP_MS;
    const visible = phaseMs <= TEAR_DURATION_MS;
    const rawT = phaseMs / TEAR_DURATION_MS;
    const t = Math.min(1, Math.max(0, rawT));
    const easedFall = t * t;
    const fadeIn = t < 0.16 ? t / 0.16 : 1;
    const fadeOut = t > 0.74 ? (1 - t) / 0.26 : 1;
    const opacity = visible ? Math.max(0, fadeIn * fadeOut) : 0;

    return {
      opacity,
      transform: [
        { translateX: drift * Math.sin(t * Math.PI) },
        { translateY: fall * easedFall },
        { scale: 0.82 + t * 0.18 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.tear,
        { left, top, width: size, height: size * 1.42 },
        animStyle,
      ]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 8 11" fill="none">
        <Path
          d="M4 0.65C3.15 2.15 1.2 4.62 1.2 6.85C1.2 8.72 2.45 10.15 4 10.15C5.55 10.15 6.8 8.72 6.8 6.85C6.8 4.62 4.85 2.15 4 0.65Z"
          fill="#6AA6FF"
        />
        <Path
          d="M3.18 3.92C2.72 4.74 2.42 5.57 2.42 6.48"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="0.7"
          opacity={0.55}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  onion: {
    height: 80,
    overflow: "visible",
    position: "relative",
    width: 80,
  },
  onionBody: {
    height: 80,
    overflow: "visible",
    position: "relative",
    width: 80,
  },
  blushLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  tearLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "visible",
  },
  tear: {
    position: "absolute",
  },
});
