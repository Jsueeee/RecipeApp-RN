import { useRouter, useSegments } from "expo-router";
import { impactMedium } from "@/app/lib/haptics";
import { useFridgesQuery } from "@/app/hooks/queries/useFridgeQuery";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import { useGuestFridgesQuery } from "@/app/lib/storage/guestFridge";
import {
  getExpirationNotificationEnabled,
  isNotificationPermissionGranted,
} from "@/app/utils/NotificationUtils";
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
import type {
  TutorialCompletionOutcome,
  TutorialSkipReason,
} from "../engine/analytics";
import { engineReducer, initialEngineState } from "../engine/reducer";
import {
  getTutorialSteps,
  type TutorialMode,
  type TutorialStepMode,
} from "../engine/steps";
import type { AnchorId, EngineState, Rect, StepConfig } from "../engine/types";
import { TutorialOverlay } from "../overlay/TutorialOverlay";
import {
  useExpirationNotificationTutorial,
  useFirstLaunch,
} from "./useFirstLaunch";

const ENTRANCE_DURATION_MS = 600;
const SUCCESS_DURATION_MS = 700;
const FIRST_LAUNCH_DELAY_MS = 900;
const EXPIRATION_NOTIFICATION_TUTORIAL_HIGHLIGHT =
  "expiration-notification";

// auto 트리거에서 타이핑이 끝난 뒤 사용자에게 보장해줄 최소 읽기 시간.
// 설정된 step.trigger.delayMs 와 비교해 더 긴 쪽을 자동 트리거 시점으로 사용한다.
const MIN_READ_DWELL_AFTER_TYPING_MS = 450;

export type TutorialContextValue = {
  state: EngineState;
  currentStep: StepConfig | undefined;
  totalSteps: number;
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
  continueGuestTutorial: () => void;
  goToLoginFromTutorial: () => void;
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
  return isTabHomeRoute(segments, "(fridge)");
}

function isMyPageTabHomeRoute(segments: readonly string[]): boolean {
  return isTabHomeRoute(segments, "(myPage)");
}

function isTabHomeRoute(
  segments: readonly string[],
  tabSegment: "(fridge)" | "(myPage)",
): boolean {
  const [root, tab, leaf] = segments;
  return (
    root === "(tabs)" &&
    tab === tabSegment &&
    (segments.length === 2 || leaf === "index")
  );
}

function shouldStartOnMyPage(step: StepConfig | undefined) {
  return (
    step?.id === "my-page-intro" ||
    step?.id === "celebration" ||
    step?.id === "guest-my-page-intro" ||
    step?.id === "guest-celebration"
  );
}

function getTutorialStartRoute(
  steps: ReadonlyArray<StepConfig>,
  stepIndex: number,
) {
  return shouldStartOnMyPage(steps[stepIndex])
    ? "/(tabs)/(myPage)"
    : "/(tabs)/(fridge)";
}

function isTutorialStartRoute(
  segments: readonly string[],
  steps: ReadonlyArray<StepConfig>,
  stepIndex: number,
): boolean {
  return shouldStartOnMyPage(steps[stepIndex])
    ? isMyPageTabHomeRoute(segments)
    : isFridgeTabHomeRoute(segments);
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
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthStatus();
  const accountTutorialMode: TutorialMode = isAuthenticated
    ? "authenticated"
    : "guest";
  const [isExpirationNotificationTutorialActive, setIsExpirationNotificationTutorialActive] =
    useState(false);
  const tutorialMode: TutorialStepMode = isExpirationNotificationTutorialActive
    ? "expiration-notification"
    : accountTutorialMode;
  const tutorialSteps = useMemo(
    () => getTutorialSteps(tutorialMode),
    [tutorialMode],
  );
  const totalSteps = tutorialSteps.length;
  const { status, resumeStepIndex, markCompleted, saveProgress } =
    useFirstLaunch(isAuthLoading ? null : accountTutorialMode);
  const {
    status: expirationNotificationTutorialStatus,
    markCompleted: markExpirationNotificationTutorialCompleted,
  } = useExpirationNotificationTutorial();

  const shouldCheckEmptyFridge =
    !isExpirationNotificationTutorialActive &&
    !isAuthLoading &&
    status === "should-start" &&
    resumeStepIndex === null &&
    Boolean(segments) &&
    !isAuthRoute(segments as readonly string[]);

  const { fridges: remoteFridges } = useFridgesQuery({
    enabled: shouldCheckEmptyFridge && isAuthenticated,
  });
  const { fridges: guestFridges } = useGuestFridgesQuery({
    enabled: shouldCheckEmptyFridge && !isAuthenticated,
  });
  const fridges = isAuthenticated ? remoteFridges : guestFridges;

  const hasNoFridgeIngredients = useMemo(
    () =>
      fridges?.every((category) => category.ingredients.length === 0) ?? false,
    [fridges],
  );
  const shouldStartMainTutorial =
    !isExpirationNotificationTutorialActive &&
    !isAuthLoading &&
    status === "should-start" &&
    (resumeStepIndex !== null || hasNoFridgeIngredients);
  const shouldStartTutorial =
    isExpirationNotificationTutorialActive || shouldStartMainTutorial;
  const tutorialStartIndex = isExpirationNotificationTutorialActive
    ? 0
    : (resumeStepIndex ?? 0);

  const lastEmittedStep = useRef<number>(-1);
  const didSkipTutorialRef = useRef(false);
  const skipReasonRef = useRef<TutorialSkipReason | null>(null);
  const didHandleTutorialDoneRef = useRef(false);
  const hasRequestedTutorialHome = useRef(false);
  const hasRequestedExpirationNotificationTutorial = useRef(false);
  const activeTutorialModeRef = useRef<TutorialStepMode | null>(null);
  const containerRef = useRef<View>(null);
  const containerOriginRef = useRef({ x: 0, y: 0 });
  const pendingAnchorActionRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const currentStep = tutorialSteps[state.stepIndex];
  const currentAnchorRect = currentStep?.anchorId
    ? state.anchors[currentStep.anchorId]
    : undefined;

  const emitTutorialStarted = useCallback(
    (step: StepConfig) => {
      emitTutorialEvent({
        type: "tutorial_started",
        mode: tutorialMode,
        startStep: step.id,
        startStepIndex: step.index,
        totalSteps,
      });
    },
    [totalSteps, tutorialMode],
  );

  const emitTutorialStepShown = useCallback(
    (step: StepConfig) => {
      emitTutorialEvent({
        type: "tutorial_step_shown",
        mode: tutorialMode,
        stepId: step.id,
        stepIndex: step.index,
        totalSteps,
      });
    },
    [totalSteps, tutorialMode],
  );

  const emitTutorialStepAdvanced = useCallback(
    (
      step: StepConfig,
      method: "auto" | "cta" | "tap" | "navigation" | "progress" | "sheet",
    ) => {
      emitTutorialEvent({
        type: "tutorial_step_advanced",
        mode: tutorialMode,
        stepId: step.id,
        stepIndex: step.index,
        method,
        totalSteps,
      });
    },
    [totalSteps, tutorialMode],
  );

  const emitTutorialSkipped = useCallback(
    (step: StepConfig, reason: TutorialSkipReason) => {
      emitTutorialEvent({
        type: "tutorial_skipped",
        mode: tutorialMode,
        atStep: step.id,
        atStepIndex: step.index,
        reason,
        totalSteps,
      });
    },
    [totalSteps, tutorialMode],
  );

  const emitTutorialCompleted = useCallback(
    (step: StepConfig) => {
      emitTutorialEvent({
        type: "tutorial_completed",
        mode: tutorialMode,
        finalStep: step.id,
        finalStepIndex: step.index,
        totalSteps,
      });
    },
    [totalSteps, tutorialMode],
  );

  const emitTutorialFinished = useCallback(
    (
      outcome: TutorialCompletionOutcome,
      step: StepConfig,
      skipReason: TutorialSkipReason | null,
    ) => {
      emitTutorialEvent({
        type: "tutorial_finished",
        mode: tutorialMode,
        outcome,
        finalStep: step.id,
        finalStepIndex: step.index,
        skipReason: skipReason ?? undefined,
        totalSteps,
      });
    },
    [totalSteps, tutorialMode],
  );

  useEffect(() => {
    didSkipTutorialRef.current = false;
    skipReasonRef.current = null;
    didHandleTutorialDoneRef.current = false;
    lastEmittedStep.current = -1;
    hasRequestedTutorialHome.current = false;
  }, [tutorialMode]);

  const clearPendingAnchorAction = useCallback(() => {
    if (!pendingAnchorActionRef.current) return;
    clearTimeout(pendingAnchorActionRef.current);
    pendingAnchorActionRef.current = null;
  }, []);

  useEffect(() => clearPendingAnchorAction, [clearPendingAnchorAction]);

  useEffect(() => {
    if (!shouldStartTutorial) return;
    if (state.hasStarted && state.phase !== "done") return;
    if (
      state.phase === "done" &&
      activeTutorialModeRef.current === tutorialMode
    ) {
      return;
    }
    if (!segments) return;
    if (!isTutorialStartRoute(segments, tutorialSteps, tutorialStartIndex)) {
      if (!isAuthRoute(segments) && !hasRequestedTutorialHome.current) {
        hasRequestedTutorialHome.current = true;
        router.replace(getTutorialStartRoute(tutorialSteps, tutorialStartIndex));
      }
      return;
    }
    hasRequestedTutorialHome.current = false;
    const t = setTimeout(() => {
      activeTutorialModeRef.current = tutorialMode;
      dispatch({
        type: "START",
        stepIndex: tutorialStartIndex,
        totalSteps,
      });
      const startStep = tutorialSteps[tutorialStartIndex];
      if (startStep) {
        emitTutorialStarted(startStep);
      }
    }, FIRST_LAUNCH_DELAY_MS);
    return () => clearTimeout(t);
  }, [
    router,
    shouldStartTutorial,
    segments,
    state.hasStarted,
    state.phase,
    totalSteps,
    emitTutorialStarted,
    tutorialMode,
    tutorialSteps,
    tutorialStartIndex,
  ]);

  useEffect(() => {
    if (state.phase !== "entering") return;
    const t = setTimeout(
      () => dispatch({ type: "ENTRANCE_COMPLETE" }),
      ENTRANCE_DURATION_MS,
    );
    return () => clearTimeout(t);
  }, [state.phase, state.stepIndex, tutorialSteps]);

  useEffect(() => {
    if (state.phase === "idle" || state.phase === "done") return;
    if (lastEmittedStep.current === state.stepIndex) return;
    lastEmittedStep.current = state.stepIndex;
    const step = tutorialSteps[state.stepIndex];
    if (step) {
      emitTutorialStepShown(step);
    }
  }, [emitTutorialStepShown, state.phase, state.stepIndex, tutorialSteps]);

  // waiting 진입 시각을 기록하고, 새 스텝에 들어갈 때마다 speechCompleted 표식을 리셋한다.
  useEffect(() => {
    if (state.phase === "waiting") {
      waitingStartRef.current = Date.now();
    }
    setSpeechCompletedForStep(null);
  }, [state.phase, state.stepIndex]);

  useEffect(() => {
    if (state.phase !== "waiting") return;

    const step = tutorialSteps[state.stepIndex];

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
    const t = setTimeout(
      () => dispatch({ type: "AUTO_TIMEOUT", step }),
      wait,
    );

    return () => clearTimeout(t);
  }, [state.phase, state.stepIndex, speechCompletedForStep, tutorialSteps]);

  useEffect(() => {
    if (state.phase !== "waiting") return;
    const step = tutorialSteps[state.stepIndex];
    if (!step) return;
    if (!segments) return;
    const segs = segments as readonly string[];

    // Primary navigation trigger
    if (
      step.trigger.type === "navigation" &&
      segs.includes(step.trigger.segmentMatch)
    ) {
      const { segmentMatch } = step.trigger;
      dispatch({ type: "NAV_MATCHED", segment: segmentMatch, step });

      return;
    }

    // Secondary advanceOnSegment fast-forward
    if (step.advanceOnSegment && segs.includes(step.advanceOnSegment)) {
      dispatch({ type: "NAV_MATCHED", segment: step.advanceOnSegment, step });
    }
  }, [segments, state.phase, state.stepIndex, tutorialSteps]);

  useEffect(() => {
    if (state.phase !== "success") return;
    const step = tutorialSteps[state.stepIndex];
    impactMedium();
    if (step) {
      const method = (() => {
        switch (step.trigger.type) {
          case "auto":
          case "auto-or-tap":
            return "auto";
          case "cta":
          case "guest-mode-choice":
            return "cta";
          case "navigation":
          case "progress":
            return step.trigger.type;
          case "tap-anchor":
            return "tap";
          case "sheet-dismiss":
            return "sheet";
        }
      })();
      emitTutorialStepAdvanced(step, method);
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
          dispatch({ type: "EXIT_COMPLETE", totalSteps });
        });
      });
    }, SUCCESS_DURATION_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
      interactionHandle?.cancel();
    };
  }, [
    emitTutorialStepAdvanced,
    state.phase,
    state.stepIndex,
    totalSteps,
    tutorialSteps,
  ]);

  useEffect(() => {
    if (!state.hasStarted) return;
    if (state.phase === "done") return;
    if (tutorialMode === "expiration-notification") return;
    saveProgress(state.stepIndex);
  }, [
    state.stepIndex,
    state.hasStarted,
    state.phase,
    saveProgress,
    tutorialMode,
  ]);

  useEffect(() => {
    if (state.phase !== "done") return;
    if (activeTutorialModeRef.current !== tutorialMode) return;
    if (didHandleTutorialDoneRef.current) return;

    didHandleTutorialDoneRef.current = true;
    const finalStep = tutorialSteps[state.stepIndex];
    const outcome: TutorialCompletionOutcome = didSkipTutorialRef.current
      ? "skipped"
      : "completed";

    if (finalStep) {
      if (outcome === "completed") {
        emitTutorialCompleted(finalStep);
      }
      emitTutorialFinished(outcome, finalStep, skipReasonRef.current);
    }

    if (tutorialMode === "expiration-notification") {
      void markExpirationNotificationTutorialCompleted();
      setIsExpirationNotificationTutorialActive(false);
      router.push({
        pathname: "/(setting)",
        params: {
          tutorialHighlight: EXPIRATION_NOTIFICATION_TUTORIAL_HIGHLIGHT,
        },
      });
      return;
    }

    void markCompleted();
    if (!didSkipTutorialRef.current && tutorialMode === "authenticated") {
      void markExpirationNotificationTutorialCompleted();
      router.push({
        pathname: "/(setting)",
        params: {
          tutorialHighlight: EXPIRATION_NOTIFICATION_TUTORIAL_HIGHLIGHT,
        },
      });
    }
  }, [
    router,
    state.phase,
    state.stepIndex,
    emitTutorialCompleted,
    emitTutorialFinished,
    markCompleted,
    markExpirationNotificationTutorialCompleted,
    tutorialSteps,
    tutorialMode,
  ]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;
    if (status !== "skip") return;
    if (expirationNotificationTutorialStatus !== "pending") return;
    if (state.phase !== "idle" && state.phase !== "done") return;
    if (!segments) return;
    if (isAuthRoute(segments as readonly string[])) return;
    if (hasRequestedExpirationNotificationTutorial.current) return;

    let cancelled = false;
    hasRequestedExpirationNotificationTutorial.current = true;

    (async () => {
      const [isExpirationNotificationEnabled, hasNotificationPermission] =
        await Promise.all([
          getExpirationNotificationEnabled(),
          isNotificationPermissionGranted(),
        ]);

      if (cancelled) return;

      if (isExpirationNotificationEnabled && hasNotificationPermission) {
        void markExpirationNotificationTutorialCompleted();
        return;
      }

      setIsExpirationNotificationTutorialActive(true);
      if (cancelled) return;
    })();

    return () => {
      cancelled = true;
    };
  }, [
    router,
    segments,
    state.phase,
    status,
    isAuthLoading,
    isAuthenticated,
    expirationNotificationTutorialStatus,
    markExpirationNotificationTutorialCompleted,
  ]);

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
      const step = tutorialSteps[state.stepIndex];
      if (
        step?.anchorId === id &&
        (step.trigger.type === "tap-anchor" ||
          step.trigger.type === "navigation")
      ) {
        dispatch({ type: "ANCHOR_TAPPED", id, step });
        return;
      }
      dispatch({ type: "ANCHOR_TAPPED", id, step });
    },
    [state.stepIndex, tutorialSteps],
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

      const step = tutorialSteps[state.stepIndex];
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
    [state.phase, state.stepIndex, tutorialSteps],
  );

  const advanceCta = useCallback(
    () =>
      dispatch({
        type: "CTA_PRESSED",
        step: tutorialSteps[state.stepIndex],
      }),
    [state.stepIndex, tutorialSteps],
  );

  const continueGuestTutorial = useCallback(
    () =>
      dispatch({
        type: "GUEST_MODE_CONTINUED",
        step: tutorialSteps[state.stepIndex],
      }),
    [state.stepIndex, tutorialSteps],
  );

  const goToLoginFromTutorial = useCallback(() => {
    const step = tutorialSteps[state.stepIndex];
    if (step) emitTutorialSkipped(step, "login_choice");
    didSkipTutorialRef.current = true;
    skipReasonRef.current = "login_choice";
    clearPendingAnchorAction();
    dispatch({ type: "SKIP" });
    router.dismissAll();
    router.replace("/(auth)");
  }, [
    clearPendingAnchorAction,
    emitTutorialSkipped,
    router,
    state.stepIndex,
    tutorialSteps,
  ]);

  const advanceScreenTap = useCallback(
    () =>
      dispatch({
        type: "SCREEN_TAPPED",
        step: tutorialSteps[state.stepIndex],
      }),
    [state.stepIndex, tutorialSteps],
  );

  const reportSheetDismiss = useCallback(
    () =>
      dispatch({
        type: "SHEET_DISMISSED",
        step: tutorialSteps[state.stepIndex],
      }),
    [state.stepIndex, tutorialSteps],
  );

  const reportProgress = useCallback(
    (key: string) => {
      dispatch({
        type: "PROGRESS_REPORTED",
        key,
        step: tutorialSteps[state.stepIndex],
      });
    },
    [state.stepIndex, tutorialSteps],
  );

  const skip = useCallback(() => {
    const step = tutorialSteps[state.stepIndex];
    if (step) emitTutorialSkipped(step, "skip_button");
    didSkipTutorialRef.current = true;
    skipReasonRef.current = "skip_button";
    clearPendingAnchorAction();
    dispatch({ type: "SKIP" });
  }, [
    clearPendingAnchorAction,
    emitTutorialSkipped,
    state.stepIndex,
    tutorialSteps,
  ]);
  const restart = useCallback(() => {
    didSkipTutorialRef.current = false;
    skipReasonRef.current = null;
    didHandleTutorialDoneRef.current = false;
    activeTutorialModeRef.current = tutorialMode;
    dispatch({ type: "RESTART" });
    const startStep = tutorialSteps[0];
    if (startStep) {
      emitTutorialStarted(startStep);
    }
  }, [emitTutorialStarted, tutorialMode, tutorialSteps]);

  const value = useMemo<TutorialContextValue>(
    () => ({
      state,
      currentStep,
      totalSteps,
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
      continueGuestTutorial,
      goToLoginFromTutorial,
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
      totalSteps,
      currentAnchorRect,
      registerAnchor,
      unregisterAnchor,
      reportAnchorTap,
      reportSpeechComplete,
      registerAnchorAction,
      triggerAnchorAction,
      advanceCta,
      continueGuestTutorial,
      goToLoginFromTutorial,
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
