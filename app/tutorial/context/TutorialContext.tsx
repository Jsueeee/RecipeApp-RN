import * as Haptics from "expo-haptics";
import { useRouter, useSegments } from "expo-router";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  InteractionManager,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { emitTutorialEvent } from "../engine/analytics";
import { engineReducer, initialEngineState } from "../engine/reducer";
import { STEPS } from "../engine/steps";
import type {
  AnchorId,
  EngineState,
  Rect,
  StepConfig,
} from "../engine/types";
import { TutorialOverlay } from "../overlay/TutorialOverlay";
import { useFirstLaunch } from "./useFirstLaunch";

const ENTRANCE_DURATION_MS = 600;
const SUCCESS_DURATION_MS = 700;
const FIRST_LAUNCH_DELAY_MS = 900;

export type TutorialContextValue = {
  state: EngineState;
  currentStep: StepConfig | undefined;
  currentAnchorRect: Rect | undefined;
  coordinateSpaceVersion: number;
  coordinateSpaceSize: { width: number; height: number };
  registerAnchor: (id: AnchorId, rect: Rect) => void;
  unregisterAnchor: (id: AnchorId) => void;
  reportAnchorTap: (id: AnchorId) => void;
  registerAnchorAction: (id: AnchorId, action: () => void) => void;
  triggerAnchorAction: (id: AnchorId) => void;
  advanceCta: () => void;
  advanceScreenTap: () => void;
  reportSheetDismiss: () => void;
  reportProgress: (key: string) => void;
  skip: () => void;
  restart: () => void;
};

export const TutorialContext = createContext<TutorialContextValue | null>(null);

type Props = { children: React.ReactNode };

function isAuthRoute(segments: readonly string[]): boolean {
  return segments[0] === "(auth)";
}

function isFridgeTabHomeRoute(segments: readonly string[]): boolean {
  const [root, tab, leaf] = segments;
  return (
    root === "(tabs)" &&
    tab === "(fridge)" &&
    (segments.length === 2 || leaf === "index")
  );
}

export function TutorialProvider({ children }: Props) {
  const [state, dispatch] = useReducer(engineReducer, initialEngineState);
  const [containerLayoutVersion, setContainerLayoutVersion] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const router = useRouter();
  const segments = useSegments();
  const { status, markCompleted, saveProgress } = useFirstLaunch();
  const lastEmittedStep = useRef<number>(-1);
  const hasRequestedTutorialHome = useRef(false);
  const containerRef = useRef<View>(null);
  const containerOriginRef = useRef({ x: 0, y: 0 });
  const pendingAnchorActionRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const currentStep = STEPS[state.stepIndex];
  const currentAnchorRect = currentStep?.anchorId
    ? state.anchors[currentStep.anchorId]
    : undefined;

  const clearPendingAnchorAction = useCallback(() => {
    if (!pendingAnchorActionRef.current) return;
    clearTimeout(pendingAnchorActionRef.current);
    pendingAnchorActionRef.current = null;
  }, []);

  useEffect(() => clearPendingAnchorAction, [clearPendingAnchorAction]);

  useEffect(() => {
    if (status !== "should-start") return;
    if (state.hasStarted) return;
    if (!segments) return;
    if (!isFridgeTabHomeRoute(segments)) {
      if (!isAuthRoute(segments) && !hasRequestedTutorialHome.current) {
        hasRequestedTutorialHome.current = true;
        router.replace("/(tabs)/(fridge)");
      }
      return;
    }
    hasRequestedTutorialHome.current = false;
    const t = setTimeout(() => {
      dispatch({ type: "START" });
      emitTutorialEvent({ type: "tutorial_started" });
    }, FIRST_LAUNCH_DELAY_MS);
    return () => clearTimeout(t);
  }, [router, status, segments, state.hasStarted]);

  useEffect(() => {
    if (state.phase !== "entering") return;
    const t = setTimeout(
      () => dispatch({ type: "ENTRANCE_COMPLETE" }),
      ENTRANCE_DURATION_MS,
    );
    return () => clearTimeout(t);
  }, [state.phase, state.stepIndex]);

  useEffect(() => {
    if (state.phase === "idle" || state.phase === "done") return;
    if (lastEmittedStep.current === state.stepIndex) return;
    lastEmittedStep.current = state.stepIndex;
    const step = STEPS[state.stepIndex];
    if (step) {
      emitTutorialEvent({ type: "tutorial_step_shown", stepId: step.id });
    }
  }, [state.phase, state.stepIndex]);

  useEffect(() => {
    if (state.phase !== "waiting") return;
    const step = STEPS[state.stepIndex];
    if (
      step?.trigger.type !== "auto" &&
      step?.trigger.type !== "auto-or-tap"
    ) {
      return;
    }
    const t = setTimeout(
      () => dispatch({ type: "AUTO_TIMEOUT" }),
      step.trigger.delayMs,
    );
    return () => clearTimeout(t);
  }, [state.phase, state.stepIndex]);

  useEffect(() => {
    if (state.phase !== "waiting") return;
    const step = STEPS[state.stepIndex];
    if (!step) return;
    if (!segments) return;
    const segs = segments as readonly string[];

    // Primary navigation trigger
    if (
      step.trigger.type === "navigation" &&
      segs.includes(step.trigger.segmentMatch)
    ) {
      const { segmentMatch } = step.trigger;
      dispatch({ type: "NAV_MATCHED", segment: segmentMatch });
      return;
    }

    // Secondary advanceOnSegment fast-forward
    if (step.advanceOnSegment && segs.includes(step.advanceOnSegment)) {
      dispatch({ type: "NAV_MATCHED", segment: step.advanceOnSegment });
    }
  }, [segments, state.phase, state.stepIndex]);

  useEffect(() => {
    if (state.phase !== "success") return;
    const step = STEPS[state.stepIndex];
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (step) {
      const method = (() => {
        switch (step.trigger.type) {
          case "auto":
          case "auto-or-tap":
            return "auto";
          case "cta":
          case "navigation":
          case "progress":
            return step.trigger.type;
          case "tap-anchor":
            return "tap";
          case "sheet-dismiss":
            return "sheet";
        }
      })();
      emitTutorialEvent({
        type: "tutorial_step_advanced",
        stepId: step.id,
        method,
      });
    }
    let cancelled = false;
    let interactionHandle: { cancel: () => void } | null = null;
    const t = setTimeout(() => {
      if (cancelled) return;
      // 화면 전환·새 화면의 첫 렌더가 끝난 뒤 다음 스텝으로 넘어가도록 보류.
      // InteractionManager는 진행 중인 인터랙션(네비게이션 트랜지션 포함)이
      // 모두 종료된 후 콜백을 실행한다. 한 프레임 더 기다려 다음 화면의
      // 레이아웃이 안정된 상태로 새 스포트라이트 애니메이션을 시작하게 한다.
      interactionHandle = InteractionManager.runAfterInteractions(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          if (cancelled) return;
          dispatch({ type: "EXIT_COMPLETE" });
        });
      });
    }, SUCCESS_DURATION_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
      interactionHandle?.cancel();
    };
  }, [state.phase, state.stepIndex]);

  useEffect(() => {
    if (!state.hasStarted) return;
    if (state.phase === "done") return;
    saveProgress(state.stepIndex);
  }, [state.stepIndex, state.hasStarted, state.phase, saveProgress]);

  useEffect(() => {
    if (state.phase !== "done") return;
    markCompleted();
    emitTutorialEvent({ type: "tutorial_completed" });
  }, [state.phase, markCompleted]);

  const measureContainerOrigin = useCallback(() => {
    requestAnimationFrame(() => {
      containerRef.current?.measureInWindow((x, y) => {
        const prev = containerOriginRef.current;
        if (Math.abs(prev.x - x) < 0.5 && Math.abs(prev.y - y) < 0.5) {
          return;
        }
        containerOriginRef.current = { x, y };
        setContainerLayoutVersion((version) => version + 1);
      });
    });
  }, []);

  const handleContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setContainerSize((prev) => {
        if (
          Math.abs(prev.width - width) < 0.5 &&
          Math.abs(prev.height - height) < 0.5
        ) {
          return prev;
        }
        return { width, height };
      });
      measureContainerOrigin();
    },
    [measureContainerOrigin],
  );

  useEffect(() => {
    const timers = [
      setTimeout(measureContainerOrigin, 0),
      setTimeout(measureContainerOrigin, 250),
      setTimeout(measureContainerOrigin, 700),
    ];
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [measureContainerOrigin]);

  const registerAnchor = useCallback(
    (id: AnchorId, rect: Rect) => {
      const origin = containerOriginRef.current;
      dispatch({
        type: "ANCHOR_MEASURED",
        id,
        rect: {
          ...rect,
          x: rect.x - origin.x,
          y: rect.y - origin.y,
        },
      });
    },
    [],
  );
  const unregisterAnchor = useCallback((id: AnchorId) => {
    dispatch({ type: "ANCHOR_REMOVED", id });
  }, []);
  const reportAnchorTap = useCallback((id: AnchorId) => {
    const step = STEPS[state.stepIndex];
    if (
      step?.anchorId === id &&
      (step.trigger.type === "tap-anchor" ||
        step.trigger.type === "navigation")
    ) {
      dispatch({ type: "ANCHOR_TAPPED", id });
      return;
    }
    dispatch({ type: "ANCHOR_TAPPED", id });
  }, [state.stepIndex]);

  const anchorActionsRef = useRef<Partial<Record<AnchorId, () => void>>>({});
  const registerAnchorAction = useCallback(
    (id: AnchorId, action: () => void) => {
      anchorActionsRef.current[id] = action;
    },
    [],
  );
  const triggerAnchorAction = useCallback((id: AnchorId) => {
    const action = anchorActionsRef.current[id];
    if (!action) return;

    const step = STEPS[state.stepIndex];
    const shouldWaitForTouchAnimation =
      state.phase === "waiting" &&
      step?.anchorId === id &&
      (step.trigger.type === "tap-anchor" ||
        step.trigger.type === "navigation");

    if (!shouldWaitForTouchAnimation) {
      action();
      return;
    }

    if (pendingAnchorActionRef.current) {
      clearTimeout(pendingAnchorActionRef.current);
    }
    pendingAnchorActionRef.current = setTimeout(() => {
      pendingAnchorActionRef.current = null;
      action();
    }, SUCCESS_DURATION_MS);
  }, [state.phase, state.stepIndex]);
  const advanceCta = useCallback(() => dispatch({ type: "CTA_PRESSED" }), []);
  const advanceScreenTap = useCallback(
    () => dispatch({ type: "SCREEN_TAPPED" }),
    [],
  );
  const reportSheetDismiss = useCallback(
    () => dispatch({ type: "SHEET_DISMISSED" }),
    [],
  );
  const reportProgress = useCallback((key: string) => {
    dispatch({ type: "PROGRESS_REPORTED", key });
  }, []);
  const skip = useCallback(() => {
    const step = STEPS[state.stepIndex];
    if (step) emitTutorialEvent({ type: "tutorial_skipped", atStep: step.id });
    clearPendingAnchorAction();
    dispatch({ type: "SKIP" });
  }, [clearPendingAnchorAction, state.stepIndex]);
  const restart = useCallback(() => {
    dispatch({ type: "RESTART" });
    emitTutorialEvent({ type: "tutorial_started" });
  }, []);

  const value = useMemo<TutorialContextValue>(
    () => ({
      state,
      currentStep,
      currentAnchorRect,
      coordinateSpaceVersion: containerLayoutVersion,
      coordinateSpaceSize: containerSize,
      registerAnchor,
      unregisterAnchor,
      reportAnchorTap,
      registerAnchorAction,
      triggerAnchorAction,
      advanceCta,
      advanceScreenTap,
      reportSheetDismiss,
      reportProgress,
      skip,
      restart,
    }),
    [
      state,
      containerLayoutVersion,
      containerSize,
      currentStep,
      currentAnchorRect,
      registerAnchor,
      unregisterAnchor,
      reportAnchorTap,
      registerAnchorAction,
      triggerAnchorAction,
      advanceCta,
      advanceScreenTap,
      reportSheetDismiss,
      reportProgress,
      skip,
      restart,
    ],
  );

  return (
    <TutorialContext.Provider value={value}>
      <View
        ref={containerRef}
        collapsable={false}
        onLayout={handleContainerLayout}
        style={{ flex: 1 }}
      >
        {children}
        <TutorialOverlay />
      </View>
    </TutorialContext.Provider>
  );
}
