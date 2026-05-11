import React, { useEffect } from "react";
import { StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Typewriter } from "./Typewriter";

const SPRING_OVERSHOOT = { damping: 12, stiffness: 150, mass: 1 };

type Props = {
  text: string;
  visible: boolean;
  showAfterDelayMs?: number;
  charDelayMs?: number;
  containerStyle?: ViewStyle;
};

/**
 * Cinematic caption — plain centered text laid directly over the dim layer.
 * No bubble box, no tail. The visual connection to the character comes from
 * proximity (consumer positions this just above/below the character) plus
 * spring-in entrance.
 */
export function SpeechBubble({
  text,
  visible,
  showAfterDelayMs = 0,
  charDelayMs = 28,
  containerStyle,
}: Props) {
  const scale = useSharedValue(0.94);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    if (visible) {
      scale.value = withDelay(
        showAfterDelayMs,
        withSpring(1, SPRING_OVERSHOOT),
      );
      opacity.value = withDelay(
        showAfterDelayMs,
        withTiming(1, { duration: 320, easing: Easing.out(Easing.quad) }),
      );
      translateY.value = withDelay(
        showAfterDelayMs,
        withSpring(0, SPRING_OVERSHOOT),
      );
    } else {
      scale.value = withTiming(0.96, {
        duration: 200,
        easing: Easing.in(Easing.quad),
      });
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(8, { duration: 200 });
    }
  }, [visible, showAfterDelayMs, scale, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const typewriterStartDelay = visible ? showAfterDelayMs + 240 : 0;

  return (
    <Animated.View style={[styles.container, containerStyle, animStyle]}>
      <Typewriter
        text={text}
        active={visible}
        startDelayMs={typewriterStartDelay}
        charDelayMs={charDelayMs}
        cursor
        style={styles.text}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 19,
    fontFamily: "cafe24",
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: 0.15,
    textShadowColor: "rgba(0, 0, 0, 0.65)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
});
