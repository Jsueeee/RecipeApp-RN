import * as Haptics from "expo-haptics";
import { useRouter, useSegments } from "expo-router";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { View } from "react-native";
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
  const router = useRouter();
  const segments = useSegments();
  const { status, markCompleted, saveProgress } = useFirstLaunch();
  const lastEmittedStep = useRef<number>(-1);
  const hasRequestedTutorialHome = useRef(false);

  const currentStep = STEPS[state.stepIndex];
  const currentAnchorRect = currentStep?.anchorId
    ? state.anchors[currentStep.anchorId]
    : undefined;

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
      dispatch({ type: "NAV_MATCHED", segment: step.trigger.segmentMatch });
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
    const t = setTimeout(
      () => dispatch({ type: "EXIT_COMPLETE" }),
      SUCCESS_DURATION_MS,
    );
    return () => clearTimeout(t);
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

  const registerAnchor = useCallback((id: AnchorId, rect: Rect) => {
    dispatch({ type: "ANCHOR_MEASURED", id, rect });
  }, []);
  const unregisterAnchor = useCallback((id: AnchorId) => {
    dispatch({ type: "ANCHOR_REMOVED", id });
  }, []);
  const reportAnchorTap = useCallback((id: AnchorId) => {
    dispatch({ type: "ANCHOR_TAPPED", id });
  }, []);

  const anchorActionsRef = useRef<Partial<Record<AnchorId, () => void>>>({});
  const registerAnchorAction = useCallback(
    (id: AnchorId, action: () => void) => {
      anchorActionsRef.current[id] = action;
    },
    [],
  );
  const triggerAnchorAction = useCallback((id: AnchorId) => {
    const action = anchorActionsRef.current[id];
    action?.();
  }, []);
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
    dispatch({ type: "SKIP" });
  }, [state.stepIndex]);
  const restart = useCallback(() => {
    dispatch({ type: "RESTART" });
    emitTutorialEvent({ type: "tutorial_started" });
  }, []);

  const value = useMemo<TutorialContextValue>(
    () => ({
      state,
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
    }),
    [
      state,
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
      <View style={{ flex: 1 }}>
        {children}
        <TutorialOverlay />
      </View>
    </TutorialContext.Provider>
  );
}
