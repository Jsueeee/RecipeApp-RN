import type { AnchorId, StepId } from "./types";
import type { TutorialStepMode } from "./steps";

export type TutorialCompletionOutcome = "completed" | "skipped";
export type TutorialSkipReason = "skip_button" | "login_choice";

type TutorialBaseAnalyticsEvent = {
  mode: TutorialStepMode;
  totalSteps: number;
};

export type TutorialAnalyticsEvent =
  | (TutorialBaseAnalyticsEvent & {
      type: "tutorial_started";
      startStep: StepId;
      startStepIndex: number;
    })
  | (TutorialBaseAnalyticsEvent & {
      type: "tutorial_step_shown";
      stepId: StepId;
      stepIndex: number;
    })
  | {
      type: "tutorial_step_advanced";
      mode: TutorialStepMode;
      stepId: StepId;
      stepIndex: number;
      method: "auto" | "cta" | "tap" | "navigation" | "progress" | "sheet";
      totalSteps: number;
    }
  | (TutorialBaseAnalyticsEvent & {
      type: "tutorial_skipped";
      atStep: StepId;
      atStepIndex: number;
      reason: TutorialSkipReason;
    })
  | (TutorialBaseAnalyticsEvent & {
      type: "tutorial_completed";
      finalStep: StepId;
      finalStepIndex: number;
    })
  | (TutorialBaseAnalyticsEvent & {
      type: "tutorial_finished";
      outcome: TutorialCompletionOutcome;
      finalStep: StepId;
      finalStepIndex: number;
      skipReason?: TutorialSkipReason;
    })
  | (TutorialBaseAnalyticsEvent & {
      type: "tutorial_anchor_timeout";
      anchorId: AnchorId;
    });

type Listener = (event: TutorialAnalyticsEvent) => void;

let listener: Listener | null = null;

export function setTutorialAnalyticsListener(fn: Listener | null): void {
  listener = fn;
}

export function emitTutorialEvent(event: TutorialAnalyticsEvent): void {
  listener?.(event);
}
