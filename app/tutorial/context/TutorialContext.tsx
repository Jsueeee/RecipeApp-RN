import { useRouter, useSegments } from "expo-router";
import { impactMedium } from "@/app/lib/haptics";
import { useFridgesQuery } from "@/app/hooks/queries/useFridgeQuery";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { InteractionManager, View, type LayoutChangeEvent } from "react-native";
import { emitTutorialEvent } from "../engine/analytics";
import { engineReducer, initialEngineState } from "../engine/reducer";
import { STEPS } from "../engine/steps";
import type { AnchorId, EngineState, Rect, StepConfig } from "../engine/types";
import { TutorialOverlay } from "../overlay/TutorialOverlay";
import { useFirstLaunch } from "./useFirstLaunch";

const ENTRANCE_DURATION_MS = 600;
const SUCCESS_DURATION_MS = 700;
const FIRST_LAUNCH_DELAY_MS = 900;

// auto 트리거에서 타이핑이 끝난 뒤 사용자에게 보장해줄 최소 읽기 시간.
// 설정된 step.trigger.delayMs 와 비교해 더 긴 쪽을 자동 트리거 시점으로 사용한다.
const MIN_READ_DWELL_AFTER_TYPING_MS = 450;

export type TutorialContextValue = {
  state: EngineState;
  currentStep: StepConfig | undefined;
  currentAnchorRect: Rect | undefined;
  coordinateSpaceVersion: number;
  coordinateSpaceSize: { width: number; height: number };
  registerAnchor: (id: AnchorId, rect: Rect) => void;
  unregisterAnchor: (id: AnchorId) => void;
  reportAnchorTap: (id: AnchorId) => void;
  reportSpeechComplete: (stepIndex: number) => void;
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
  // 현재 스텝의 SpeechBubble 타이핑이 완료된 시점을 추적. auto 트리거는 이 신호 + 읽기 여백
  // 후에 발사돼서 어떤 기기에서도 텍스트가 잘리지 않도록 한다.
  const [speechCompletedForStep, setSpeechCompletedForStep] = useState<
    number | null
  >(null);
  const waitingStartRef = useRef<number>(0);
  const router = useRouter();
  const segments = useSegments();
  const { status, resumeStepIndex, markCompleted, saveProgress } =
    useFirstLaunch();

  const shouldCheckEmptyFridge =
    status === "should-start" &&
    resumeStepIndex === null &&
    Boolean(segments) &&
    !isAuthRoute(segments as readonly string[]);

  const { fridges } = useFridgesQuery({ enabled: shouldCheckEmptyFridge });

  const hasNoFridgeIngredients = useMemo(
    () =>
      fridges?.every((category) => category.ingredients.length === 0) ?? false,
    [fridges],
  );
  const shouldStartTutorial =
    status === "should-start" &&
    (resumeStepIndex !== null || hasNoFridgeIngredients);

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
    if (!shouldStartTutorial) return;
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
  }, [router, shouldStartTutorial, segments, state.hasStarted]);

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

  // waiting 진입 시각을 기록하고, 새 스텝에 들어갈 때마다 speechCompleted 표식을 리셋한다.
  useEffect(() => {
    if (state.phase === "waiting") {
      waitingStartRef.current = Date.now();
    }
    setSpeechCompletedForStep(null);
  }, [state.phase, state.stepIndex]);

  useEffect(() => {
    if (state.phase !== "waiting") return;

    const step = STEPS[state.stepIndex];

    if (step?.trigger.type !== "auto" && step?.trigger.type !== "auto-or-tap") {
      return;
    }

    const hasSpeech = Boolean(step.speech);
    // speech 가 있는 스텝은 타이핑 완료 신호가 올 때까지 트리거 자체를 미룬다.
    if (hasSpeech && speechCompletedForStep !== state.stepIndex) {
      return;
    }

    // speech 없음 OR speech 완료됨 → 발사 시점 계산.
    // - 설정된 delayMs (waiting 시작 기준의 절대 시각) 를 가능한 한 존중한다
    // - 단, 타이핑 종료 후 최소 MIN_READ_DWELL_AFTER_TYPING_MS 는 읽을 시간을 보장
    const elapsed = Date.now() - waitingStartRef.current;
    const remainingOfConfigured = Math.max(0, step.trigger.delayMs - elapsed);
    const wait = hasSpeech
      ? Math.max(remainingOfConfigured, MIN_READ_DWELL_AFTER_TYPING_MS)
      : step.trigger.delayMs;
    const t = setTimeout(() => dispatch({ type: "AUTO_TIMEOUT" }), wait);

    return () => clearTimeout(t);
  }, [state.phase, state.stepIndex, speechCompletedForStep]);

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
    impactMedium();
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

  const registerAnchor = useCallback((id: AnchorId, rect: Rect) => {
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
  }, []);

  const unregisterAnchor = useCallback((id: AnchorId) => {
    dispatch({ type: "ANCHOR_REMOVED", id });
  }, []);

  const reportAnchorTap = useCallback(
    (id: AnchorId) => {
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
    },
    [state.stepIndex],
  );
  const reportSpeechComplete = useCallback((stepIndex: number) => {
    setSpeechCompletedForStep(stepIndex);
  }, []);

  const anchorActionsRef = useRef<Partial<Record<AnchorId, () => void>>>({});
  const registerAnchorAction = useCallback(
    (id: AnchorId, action: () => void) => {
      anchorActionsRef.current[id] = action;
    },
    [],
  );

  const triggerAnchorAction = useCallback(
    (id: AnchorId) => {
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
    },
    [state.phase, state.stepIndex],
  );

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
      reportSpeechComplete,
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
      reportSpeechComplete,
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
