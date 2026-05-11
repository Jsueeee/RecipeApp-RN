import React, { useCallback, useEffect, useRef } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { useTutorial } from "../context/useTutorial";
import type { AnchorId } from "../engine/types";

type Props = {
  id: AnchorId;
  children: React.ReactNode;
  /**
   * Pass through to the wrapping View. Use this when wrapping an absolutely
   * positioned target — give the anchor the same absolute positioning so its
   * `measureInWindow` returns the correct screen rect.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * If true, taps on this anchor's children will advance the tutorial when the
   * current step is waiting on `tap-anchor` for this id. Set to false when the
   * underlying button has its own onPress that already calls `reportAnchorTap`.
   */
  reportTapOnPress?: boolean;
};

export function TutorialAnchor({
  id,
  children,
  style,
  reportTapOnPress = false,
}: Props) {
  const ref = useRef<View>(null);
  const {
    currentStep,
    registerAnchor,
    unregisterAnchor,
    reportAnchorTap,
    state,
  } = useTutorial();

  const measure = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.measureInWindow((x, y, width, height) => {
        if (width === 0 || height === 0) return;
        registerAnchor(id, { x, y, width, height });
      });
    });
  }, [id, registerAnchor]);

  useEffect(() => {
    // Late re-measure to catch layout shifts after children (e.g. FlashList,
    // images) finish laying out beyond the initial onLayout pass.
    const timers = [
      setTimeout(measure, 200),
      setTimeout(measure, 600),
    ];
    return () => {
      timers.forEach(clearTimeout);
      unregisterAnchor(id);
    };
  }, [id, measure, unregisterAnchor]);

  useEffect(() => {
    if (currentStep?.anchorId !== id) return;
    const timers = [
      setTimeout(measure, 0),
      setTimeout(measure, 120),
      setTimeout(measure, 320),
      setTimeout(measure, 700),
    ];
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [currentStep?.anchorId, id, measure, state.phase]);

  return (
    <View
      ref={ref}
      collapsable={false}
      onLayout={measure}
      style={style}
      onTouchEnd={reportTapOnPress ? () => reportAnchorTap(id) : undefined}
    >
      {children}
    </View>
  );
}
