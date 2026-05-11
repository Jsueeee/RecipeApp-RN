import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, Mask, Rect as SvgRect } from "react-native-svg";
import type { Rect, SpotlightShape } from "../engine/types";

const AnimatedRect = Animated.createAnimatedComponent(SvgRect);

const SPRING = { damping: 18, stiffness: 140, mass: 1 } as const;
const BREATH_CYCLE_MS = 1700;
const RIPPLE_CYCLE_MS = 1350;

type Props = {
  rect: Rect | null;
  isSuccess?: boolean;
  shape?: SpotlightShape;
  padding?: number;
  radius?: number;
  dimOpacity?: number;
  ringColor?: string;
};

export function Spotlight({
  rect,
  isSuccess = false,
  shape = "rect",
  padding = 8,
  radius = 16,
  dimOpacity = 0.62,
  ringColor = "#6FE4C7",
}: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();

  const x = useSharedValue(rect ? rect.x - padding : screenW / 2);
  const y = useSharedValue(rect ? rect.y - padding : screenH / 2);
  const w = useSharedValue(rect ? rect.width + padding * 2 : 0);
  const h = useSharedValue(rect ? rect.height + padding * 2 : 0);

  useEffect(() => {
    if (rect) {
      x.value = withSpring(rect.x - padding, SPRING);
      y.value = withSpring(rect.y - padding, SPRING);
      w.value = withSpring(rect.width + padding * 2, SPRING);
      h.value = withSpring(rect.height + padding * 2, SPRING);
    } else {
      x.value = withSpring(screenW / 2, SPRING);
      y.value = withSpring(screenH / 2, SPRING);
      w.value = withSpring(0, SPRING);
      h.value = withSpring(0, SPRING);
    }
  }, [rect, padding, screenW, screenH, x, y, w, h]);

  const isCircle = shape === "circle";

  const holeProps = useAnimatedProps(() => {
    const r = isCircle ? Math.max(w.value, h.value) / 2 : radius;
    return {
      x: x.value,
      y: y.value,
      width: w.value,
      height: h.value,
      rx: r,
      ry: r,
    };
  });

  const breathScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.22);
  const outlineOpacity = useSharedValue(0.92);
  const rippleScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0);

  useEffect(() => {
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.018, {
          duration: BREATH_CYCLE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(1, {
          duration: BREATH_CYCLE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      true,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.34, {
          duration: BREATH_CYCLE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0.18, {
          duration: BREATH_CYCLE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      true,
    );
    outlineOpacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: BREATH_CYCLE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0.82, {
          duration: BREATH_CYCLE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      true,
    );
    rippleScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(1.3, {
          duration: RIPPLE_CYCLE_MS,
          easing: Easing.out(Easing.quad),
        }),
      ),
      -1,
      false,
    );
    rippleOpacity.value = withRepeat(
      withSequence(
        withTiming(0.46, { duration: 0 }),
        withTiming(0, {
          duration: RIPPLE_CYCLE_MS,
          easing: Easing.out(Easing.quad),
        }),
      ),
      -1,
      false,
    );
  }, [breathScale, glowOpacity, outlineOpacity, rippleScale, rippleOpacity]);

  const glowProps = useAnimatedProps(() =>
    makeRingProps(
      x.value,
      y.value,
      w.value,
      h.value,
      breathScale.value,
      glowOpacity.value,
      isCircle,
      radius,
    ),
  );
  const outlineProps = useAnimatedProps(() =>
    makeRingProps(
      x.value,
      y.value,
      w.value,
      h.value,
      1,
      outlineOpacity.value,
      isCircle,
      radius,
    ),
  );
  const hairlineProps = useAnimatedProps(() =>
    makeRingProps(
      x.value,
      y.value,
      w.value,
      h.value,
      0.992,
      0.9,
      isCircle,
      radius,
    ),
  );
  const rippleProps = useAnimatedProps(() =>
    makeRingProps(
      x.value,
      y.value,
      w.value,
      h.value,
      rippleScale.value,
      rippleOpacity.value,
      isCircle,
      radius,
    ),
  );
  // Success burst — one-shot ring explosion
  const burstScale = useSharedValue(1);
  const burstOpacity = useSharedValue(0);
  useEffect(() => {
    if (!isSuccess || !rect) return;
    burstScale.value = 1.02;
    burstOpacity.value = 0.75;
    burstScale.value = withTiming(1.22, {
      duration: 360,
      easing: Easing.out(Easing.quad),
    });
    burstOpacity.value = withTiming(0, {
      duration: 360,
      easing: Easing.out(Easing.quad),
    });
  }, [isSuccess, rect, burstScale, burstOpacity]);

  const burstProps = useAnimatedProps(() =>
    makeRingProps(
      x.value,
      y.value,
      w.value,
      h.value,
      burstScale.value,
      burstOpacity.value,
      isCircle,
      radius * 1.4,
    ),
  );

  return (
    <Svg
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      width={screenW}
      height={screenH}
    >
      <Defs>
        <Mask id="tutorial-spot">
          <SvgRect x={0} y={0} width={screenW} height={screenH} fill="white" />
          <AnimatedRect animatedProps={holeProps} fill="black" />
        </Mask>
      </Defs>
      <SvgRect
        x={0}
        y={0}
        width={screenW}
        height={screenH}
        fill="black"
        opacity={dimOpacity}
        mask="url(#tutorial-spot)"
      />
      <AnimatedRect
        animatedProps={glowProps}
        stroke={ringColor}
        strokeWidth={8}
        fill="none"
      />
      <AnimatedRect
        animatedProps={outlineProps}
        stroke={ringColor}
        strokeWidth={2}
        fill="none"
      />
      <AnimatedRect
        animatedProps={hairlineProps}
        stroke="#FFFFFF"
        strokeWidth={1.25}
        fill="none"
      />
      <AnimatedRect
        animatedProps={rippleProps}
        stroke={ringColor}
        strokeWidth={2}
        fill="none"
      />
      <AnimatedRect
        animatedProps={burstProps}
        stroke={ringColor}
        strokeWidth={3}
        fill="none"
      />
    </Svg>
  );
}

function makeRingProps(
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number,
  opacity: number,
  isCircle: boolean,
  defaultRadius: number,
) {
  "worklet";
  const cx = x + w / 2;
  const cy = y + h / 2;
  const sw = w * scale;
  const sh = h * scale;
  const fade = w < 4 || h < 4 ? 0 : opacity;
  const r = isCircle ? Math.max(sw, sh) / 2 : defaultRadius;
  return {
    x: cx - sw / 2,
    y: cy - sh / 2,
    width: sw,
    height: sh,
    rx: r,
    ry: r,
    opacity: fade,
  };
}
