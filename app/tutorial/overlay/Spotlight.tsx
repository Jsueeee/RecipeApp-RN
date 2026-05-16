import React, { useEffect, useRef } from "react";
import {
  InteractionManager,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path as SvgPath } from "react-native-svg";
import type { Rect, SpotlightShape } from "../engine/types";

const AnimatedPath = Animated.createAnimatedComponent(SvgPath);

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
  const pendingEnterRef = useRef<{ cancel: () => void } | null>(null);

  useEffect(() => {
    return () => {
      pendingEnterRef.current?.cancel();
      pendingEnterRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (rect) {
      if (!isAliveRef.current) {
        // 등장 애니메이션이 아직 시작되지 않은 동안에는 위치만 즉시 스냅한다.
        // 이렇게 하면 화면 전환 직후 추가 측정값이 들어와도 어차피 보이지 않는
        // 상태이므로 스프링 없이 매번 최신 좌표로 갈아끼울 수 있다.
        x.value = rect.x - padding;
        y.value = rect.y - padding;
        w.value = rect.width + padding * 2;
        h.value = rect.height + padding * 2;

        if (!pendingEnterRef.current) {
          // 첫 측정: 화면 전환과 새 화면의 첫 레이아웃·렌더 패스가 끝난 뒤에
          // "뿅" 스프링을 시작한다. InteractionManager 는 진행 중인 인터랙션
          // (Expo Router 트랜지션 포함)이 종료된 뒤 콜백을 실행하고, 추가 2 프레임을
          // 기다려 새 화면이 첫 페인트를 마치도록 둔다.
          let cancelled = false;
          const handle = {
            cancel: () => {
              cancelled = true;
            },
          };
          pendingEnterRef.current = handle;
          InteractionManager.runAfterInteractions(() => {
            if (cancelled) return;
            requestAnimationFrame(() => {
              if (cancelled) return;
              requestAnimationFrame(() => {
                if (cancelled) return;
                isAliveRef.current = true;
                startAmbientAnimations();
                aliveProgress.value = withSpring(1, POP_SPRING);
                if (pendingEnterRef.current === handle) {
                  pendingEnterRef.current = null;
                }
              });
            });
          });
        }
      } else {
        // 등장이 끝난 뒤 같은 스텝에서 앵커가 다시 측정된 경우 — 위치만 부드럽게.
        x.value = withSpring(rect.x - padding, SPRING);
        y.value = withSpring(rect.y - padding, SPRING);
        w.value = withSpring(rect.width + padding * 2, SPRING);
        h.value = withSpring(rect.height + padding * 2, SPRING);
      }
    } else {
      // 역할이 끝나면 그 자리에서 작게 줄어들며 사라지도록
      // 위치는 그대로 두고 aliveProgress만 0으로 보낸다. 등장 대기 중이었다면
      // 그것도 함께 취소하고, 반복 애니메이션도 멈춰 UI 스레드 부담을 줄인다.
      pendingEnterRef.current?.cancel();
      pendingEnterRef.current = null;
      stopAmbientAnimations();
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

  // 등장이 실제로 시작될 때까지(=화면 전환·첫 레이아웃이 끝날 때까지) 반복
  // 애니메이션을 보류해 UI 스레드 부담을 덜어준다. startAmbientAnimations 는
  // 등장 보류 콜백 안에서 호출되며, 컴포넌트 unmount/사라질 때 취소된다.
  const startAmbientAnimations = () => {
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
  };

  const stopAmbientAnimations = () => {
    cancelAnimation(breathScale);
    cancelAnimation(glowOpacity);
    cancelAnimation(outlineOpacity);
    cancelAnimation(rippleScale);
    cancelAnimation(rippleOpacity);
    // 정지 후 정적인 기본값으로 되돌려둔다.
    breathScale.value = 1;
    glowOpacity.value = 0.22;
    outlineOpacity.value = 0.92;
    rippleScale.value = 1;
    rippleOpacity.value = 0;
  };

  useEffect(() => {
    return stopAmbientAnimations;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 링 5개를 View 보더로 그린다. SVG처럼 부모 캔버스 repaint를 트리거하지 않아
  // 안드로이드에서 매 프레임 비용이 SVG <Rect> 대비 큰 폭으로 작다.
  // SVG stroke는 path 중심에 그려지지만 View border는 안쪽으로만 그려지므로,
  // 같은 외곽 위치를 얻기 위해 박스를 borderWidth/2 만큼 사방으로 확장하고
  // borderRadius도 그만큼 키운다.
  const glowStyle = useAnimatedStyle(() => {
    const scale = breathScale.value * aliveProgress.value;
    const sw = w.value * scale;
    const sh = h.value * scale;
    const cx = x.value + w.value / 2;
    const cy = y.value + h.value / 2;
    const fade =
      w.value < 4 || h.value < 4 ? 0 : glowOpacity.value * aliveProgress.value;
    const half = 8 / 2;
    const baseR = isCircle ? Math.max(sw, sh) / 2 : radius;
    return {
      left: cx - sw / 2 - half,
      top: cy - sh / 2 - half,
      width: sw + half * 2,
      height: sh + half * 2,
      borderRadius: baseR + half,
      opacity: fade,
    };
  });

  const outlineStyle = useAnimatedStyle(() => {
    const sw = w.value * aliveProgress.value;
    const sh = h.value * aliveProgress.value;
    const cx = x.value + w.value / 2;
    const cy = y.value + h.value / 2;
    const fade =
      w.value < 4 || h.value < 4
        ? 0
        : outlineOpacity.value * aliveProgress.value;
    const half = 2 / 2;
    const baseR = isCircle ? Math.max(sw, sh) / 2 : radius;
    return {
      left: cx - sw / 2 - half,
      top: cy - sh / 2 - half,
      width: sw + half * 2,
      height: sh + half * 2,
      borderRadius: baseR + half,
      opacity: fade,
    };
  });

  const hairlineStyle = useAnimatedStyle(() => {
    const scale = 0.992 * aliveProgress.value;
    const sw = w.value * scale;
    const sh = h.value * scale;
    const cx = x.value + w.value / 2;
    const cy = y.value + h.value / 2;
    const fade = w.value < 4 || h.value < 4 ? 0 : 0.9 * aliveProgress.value;
    const half = 1.25 / 2;
    const baseR = isCircle ? Math.max(sw, sh) / 2 : radius;
    return {
      left: cx - sw / 2 - half,
      top: cy - sh / 2 - half,
      width: sw + half * 2,
      height: sh + half * 2,
      borderRadius: baseR + half,
      opacity: fade,
    };
  });

  const rippleStyle = useAnimatedStyle(() => {
    const scale = rippleScale.value * aliveProgress.value;
    const sw = w.value * scale;
    const sh = h.value * scale;
    const cx = x.value + w.value / 2;
    const cy = y.value + h.value / 2;
    const fade =
      w.value < 4 || h.value < 4
        ? 0
        : rippleOpacity.value * aliveProgress.value;
    const half = 2 / 2;
    const baseR = isCircle ? Math.max(sw, sh) / 2 : radius;
    return {
      left: cx - sw / 2 - half,
      top: cy - sh / 2 - half,
      width: sw + half * 2,
      height: sh + half * 2,
      borderRadius: baseR + half,
      opacity: fade,
    };
  });

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

  const burstStyle = useAnimatedStyle(() => {
    const scale = burstScale.value;
    const sw = w.value * scale;
    const sh = h.value * scale;
    const cx = x.value + w.value / 2;
    const cy = y.value + h.value / 2;
    const fade = w.value < 4 || h.value < 4 ? 0 : burstOpacity.value;
    const half = 3 / 2;
    const baseR = isCircle ? Math.max(sw, sh) / 2 : radius * 1.4;
    return {
      left: cx - sw / 2 - half,
      top: cy - sh / 2 - half,
      width: sw + half * 2,
      height: sh + half * 2,
      borderRadius: baseR + half,
      opacity: fade,
    };
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
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
      </Svg>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          { borderColor: ringColor, borderWidth: 8 },
          glowStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          { borderColor: ringColor, borderWidth: 2 },
          outlineStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          { borderColor: "#FFFFFF", borderWidth: 1.25 },
          hairlineStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          { borderColor: ringColor, borderWidth: 2 },
          rippleStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          { borderColor: ringColor, borderWidth: 3 },
          burstStyle,
        ]}
      />
    </View>
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

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    backgroundColor: "transparent",
  },
});
