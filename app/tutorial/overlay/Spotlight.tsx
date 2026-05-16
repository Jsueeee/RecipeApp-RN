import React, { useEffect, useRef } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path as SvgPath, Rect as SvgRect } from "react-native-svg";
import type { Rect, SpotlightShape } from "../engine/types";

const AnimatedPath = Animated.createAnimatedComponent(SvgPath);
const AnimatedRect = Animated.createAnimatedComponent(SvgRect);

const SPRING = { damping: 18, stiffness: 140, mass: 1 } as const;
const POP_SPRING = { damping: 12, stiffness: 220, mass: 1 } as const;
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
  viewportWidth?: number;
  viewportHeight?: number;
};

function SpotlightBase({
  rect,
  isSuccess = false,
  shape = "rect",
  padding = 8,
  radius = 16,
  dimOpacity = 0.62,
  ringColor = "#6FE4C7",
  viewportWidth,
  viewportHeight,
}: Props) {
  const windowDimensions = useWindowDimensions();
  const screenW = viewportWidth || windowDimensions.width;
  const screenH = viewportHeight || windowDimensions.height;

  const x = useSharedValue(rect ? rect.x - padding : screenW / 2);
  const y = useSharedValue(rect ? rect.y - padding : screenH / 2);
  const w = useSharedValue(rect ? rect.width + padding * 2 : 0);
  const h = useSharedValue(rect ? rect.height + padding * 2 : 0);
  const aliveProgress = useSharedValue(0);
  const isAliveRef = useRef(false);

  useEffect(() => {
    if (rect) {
      if (!isAliveRef.current) {
        // 첫 등장: 화면 가운데에서 날아오지 않게 타겟 위치로 즉시 스냅한 뒤
        // aliveProgress 만 스프링으로 부풀려 그 자리에서 "뿅" 하고 나타나도록.
        x.value = rect.x - padding;
        y.value = rect.y - padding;
        w.value = rect.width + padding * 2;
        h.value = rect.height + padding * 2;
        aliveProgress.value = withSpring(1, POP_SPRING);
        isAliveRef.current = true;
      } else {
        // 같은 스텝에서 앵커가 다시 측정된 경우 — 위치만 부드럽게 따라간다.
        x.value = withSpring(rect.x - padding, SPRING);
        y.value = withSpring(rect.y - padding, SPRING);
        w.value = withSpring(rect.width + padding * 2, SPRING);
        h.value = withSpring(rect.height + padding * 2, SPRING);
      }
    } else {
      // 역할이 끝나면 그 자리에서 작게 줄어들며 사라지도록
      // 위치는 그대로 두고 aliveProgress만 0으로 보낸다.
      aliveProgress.value = withTiming(0, {
        duration: 240,
        easing: Easing.in(Easing.quad),
      });
      isAliveRef.current = false;
    }
  }, [rect, padding, screenW, screenH, x, y, w, h, aliveProgress]);

  const isCircle = shape === "circle";

  const dimProps = useAnimatedProps(() => {
    return {
      d: makeDimPath(
        screenW,
        screenH,
        x.value,
        y.value,
        w.value,
        h.value,
        isCircle,
        radius,
        aliveProgress.value,
      ),
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

    return () => {
      cancelAnimation(breathScale);
      cancelAnimation(glowOpacity);
      cancelAnimation(outlineOpacity);
      cancelAnimation(rippleScale);
      cancelAnimation(rippleOpacity);
    };
  }, [breathScale, glowOpacity, outlineOpacity, rippleScale, rippleOpacity]);

  const glowProps = useAnimatedProps(() =>
    makeRingProps(
      x.value,
      y.value,
      w.value,
      h.value,
      breathScale.value * aliveProgress.value,
      glowOpacity.value * aliveProgress.value,
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
      aliveProgress.value,
      outlineOpacity.value * aliveProgress.value,
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
      0.992 * aliveProgress.value,
      0.9 * aliveProgress.value,
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
      rippleScale.value * aliveProgress.value,
      rippleOpacity.value * aliveProgress.value,
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
      <AnimatedPath
        animatedProps={dimProps}
        fill="black"
        opacity={dimOpacity}
        fillRule="evenodd"
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

export const Spotlight = React.memo(
  SpotlightBase,
  (prev, next) =>
    prev.isSuccess === next.isSuccess &&
    prev.shape === next.shape &&
    prev.padding === next.padding &&
    prev.radius === next.radius &&
    prev.dimOpacity === next.dimOpacity &&
    prev.ringColor === next.ringColor &&
    prev.viewportWidth === next.viewportWidth &&
    prev.viewportHeight === next.viewportHeight &&
    areRectsEqual(prev.rect, next.rect),
);

function areRectsEqual(a: Rect | null, b: Rect | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height
  );
}

function makeDimPath(
  screenW: number,
  screenH: number,
  x: number,
  y: number,
  w: number,
  h: number,
  isCircle: boolean,
  defaultRadius: number,
  progress: number,
) {
  "worklet";
  const outer = `M0 0 H${screenW} V${screenH} H0 Z`;
  const sw = w * progress;
  const sh = h * progress;
  if (sw < 4 || sh < 4) {
    return outer;
  }

  const cx = x + w / 2;
  const cy = y + h / 2;
  const ex = cx - sw / 2;
  const ey = cy - sh / 2;

  if (isCircle) {
    const r = Math.max(sw, sh) / 2;
    return `${outer} M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
  }

  const r = Math.max(0, Math.min(defaultRadius, sw / 2, sh / 2));
  const right = ex + sw;
  const bottom = ey + sh;
  return `${outer} M${ex + r} ${ey} H${right - r} Q${right} ${ey} ${right} ${ey + r} V${bottom - r} Q${right} ${bottom} ${right - r} ${bottom} H${ex + r} Q${ex} ${bottom} ${ex} ${bottom - r} V${ey + r} Q${ex} ${ey} ${ex + r} ${ey} Z`;
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
