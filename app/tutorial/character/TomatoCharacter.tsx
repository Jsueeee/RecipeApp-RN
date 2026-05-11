import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { CharacterEmotion, Phase } from "../engine/types";
import {
  cheerPump,
  celebrationSpin,
  idleBreath,
  idleFloat,
  pointingShake,
  settleWobble,
  SPRING_BOUNCY,
  SPRING_DROP,
  SPRING_GLIDE,
  SPRING_LEAN_RETURN,
  SPRING_SNAPPY,
  tauntBob,
} from "./characterMotions";

export const CHARACTER_BODY_W = 84;
export const CHARACTER_BODY_H = 78;
const SHADOW_W = 58;
const SHADOW_H = 7;
const CONTAINER_H = CHARACTER_BODY_H + SHADOW_H + 4;

type Props = {
  position: { left: number; top: number };
  emotion: CharacterEmotion;
  phase: Phase;
};

export function TomatoCharacter({ position, emotion, phase }: Props) {
  const left = useSharedValue(position.left);
  const top = useSharedValue(position.top);

  // Direction-aware lean — leans toward direction of travel, then springs back
  const leanRotation = useSharedValue(0);
  const settleRotation = useSharedValue(0);
  const prevPositionRef = useRef({ left: position.left, top: position.top });
  const isFirstPositionRef = useRef(true);

  useEffect(() => {
    left.value = withSpring(position.left, SPRING_GLIDE);
    top.value = withSpring(position.top, SPRING_GLIDE);

    if (isFirstPositionRef.current) {
      isFirstPositionRef.current = false;
      prevPositionRef.current = { left: position.left, top: position.top };
      return;
    }

    const dx = position.left - prevPositionRef.current.left;
    const dy = position.top - prevPositionRef.current.top;
    prevPositionRef.current = { left: position.left, top: position.top };

    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      const leanDeg = Math.max(-14, Math.min(14, dx * 0.07));
      leanRotation.value = withSequence(
        withTiming(leanDeg, {
          duration: 220,
          easing: Easing.out(Easing.quad),
        }),
        withSpring(0, SPRING_LEAN_RETURN),
      );
      settleRotation.value = withDelay(450, settleWobble());
    }
  }, [position.left, position.top, left, top, leanRotation, settleRotation]);

  // Entrance — drop from above with squash
  const entranceY = useSharedValue(-180);
  const entranceScaleY = useSharedValue(0.6);
  const entranceScaleX = useSharedValue(1.1);
  const entranceOpacity = useSharedValue(0);

  useEffect(() => {
    entranceOpacity.value = withTiming(1, {
      duration: 220,
      easing: Easing.out(Easing.quad),
    });
    entranceY.value = withDelay(80, withSpring(0, SPRING_DROP));
    // Drop landing → squash → settle (compose via sequence)
    entranceScaleY.value = withDelay(
      80,
      withSequence(
        withTiming(0.6, { duration: 100 }),
        withTiming(1.15, { duration: 220, easing: Easing.out(Easing.cubic) }),
        withTiming(0.85, { duration: 110, easing: Easing.in(Easing.quad) }),
        withSpring(1, SPRING_BOUNCY),
      ),
    );
    entranceScaleX.value = withDelay(
      80,
      withSequence(
        withTiming(1.1, { duration: 100 }),
        withTiming(0.9, { duration: 220, easing: Easing.out(Easing.cubic) }),
        withTiming(1.15, { duration: 110, easing: Easing.in(Easing.quad) }),
        withSpring(1, SPRING_BOUNCY),
      ),
    );
  }, [
    entranceOpacity,
    entranceY,
    entranceScaleX,
    entranceScaleY,
  ]);

  // Idle floating + breath
  const idleY = useSharedValue(0);
  const breathScale = useSharedValue(1);
  useEffect(() => {
    idleY.value = idleFloat();
    breathScale.value = idleBreath();
    return () => {
      cancelAnimation(idleY);
      cancelAnimation(breathScale);
    };
  }, [idleY, breathScale]);

  // Emotion-specific motion
  const emotionX = useSharedValue(0);
  const emotionYOffset = useSharedValue(0);
  const emotionScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const visibleOpacity = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(emotionX);
    cancelAnimation(emotionYOffset);
    cancelAnimation(emotionScale);
    cancelAnimation(rotation);

    emotionX.value = withSpring(0, SPRING_SNAPPY);
    emotionYOffset.value = withSpring(0, SPRING_SNAPPY);
    emotionScale.value = withSpring(1, SPRING_SNAPPY);
    rotation.value = withTiming(0, { duration: 200 });

    switch (emotion) {
      case "pointing":
        emotionX.value = pointingShake();
        break;
      case "taunting":
        emotionYOffset.value = tauntBob();
        break;
      case "cheering":
        emotionScale.value = cheerPump();
        break;
      case "celebrating":
        emotionScale.value = cheerPump();
        rotation.value = celebrationSpin();
        break;
      case "hidden":
        visibleOpacity.value = withTiming(0.25, { duration: 300 });
        emotionYOffset.value = withSpring(80, SPRING_SNAPPY);
        return;
      case "happy":
      default:
        break;
    }
    visibleOpacity.value = withTiming(1, { duration: 300 });
  }, [emotion, emotionX, emotionYOffset, emotionScale, rotation, visibleOpacity]);

  // Success bounce — fires once when phase becomes 'success'
  const successScale = useSharedValue(1);
  const successRotation = useSharedValue(0);
  useEffect(() => {
    if (phase !== "success") return;
    successScale.value = withSequence(
      withTiming(1.25, { duration: 180, easing: Easing.out(Easing.quad) }),
      withSpring(1, SPRING_BOUNCY),
    );
    successRotation.value = withSequence(
      withTiming(18, { duration: 160, easing: Easing.out(Easing.quad) }),
      withSpring(0, SPRING_BOUNCY),
    );
  }, [phase, successScale, successRotation]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: left.value }, { translateY: top.value }],
  }));

  const bodyStyle = useAnimatedStyle(() => {
    const compY = entranceY.value + idleY.value + emotionYOffset.value;
    const compScale =
      emotionScale.value * successScale.value * breathScale.value;
    const compRot =
      rotation.value +
      successRotation.value +
      leanRotation.value +
      settleRotation.value;
    return {
      transform: [
        { translateX: emotionX.value },
        { translateY: compY },
        { scale: compScale },
        { scaleX: entranceScaleX.value },
        { scaleY: entranceScaleY.value },
        { rotate: `${compRot}deg` },
      ],
      opacity: entranceOpacity.value * visibleOpacity.value,
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const heightOffset = idleY.value + entranceY.value;
    const proximity = Math.max(0, 1 - Math.abs(heightOffset) * 0.012);
    return {
      opacity: entranceOpacity.value * visibleOpacity.value * 0.28 * proximity,
      transform: [
        { scaleX: 0.72 + proximity * 0.46 },
        { scaleY: 0.7 + proximity * 0.28 },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, containerStyle]}
    >
      <Animated.View style={[styles.shadow, shadowStyle]} />
      <Animated.Image
        source={require("@/assets/images/img_splash_tomato.png")}
        style={[styles.body, bodyStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    width: CHARACTER_BODY_W,
    height: CONTAINER_H,
  },
  body: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CHARACTER_BODY_W,
    height: CHARACTER_BODY_H,
  },
  shadow: {
    position: "absolute",
    bottom: 0,
    left: (CHARACTER_BODY_W - SHADOW_W) / 2,
    width: SHADOW_W,
    height: SHADOW_H,
    borderRadius: SHADOW_H / 2,
    backgroundColor: "rgba(20, 32, 28, 0.28)",
    shadowColor: "#14201C",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
