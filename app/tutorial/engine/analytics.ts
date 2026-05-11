import type { AnchorId, StepId } from "./types";

export type TutorialAnalyticsEvent =
  | { type: "tutorial_started" }
  | { type: "tutorial_step_shown"; stepId: StepId }
  | {
      type: "tutorial_step_advanced";
      stepId: StepId;
      method: "auto" | "cta" | "tap" | "navigation" | "progress" | "sheet";
    }
  | { type: "tutorial_skipped"; atStep: StepId }
  | { type: "tutorial_completed" }
  | { type: "tutorial_anchor_timeout"; anchorId: AnchorId };

type Listener = (event: TutorialAnalyticsEvent) => void;

let listener: Listener | null = null;

export function setTutorialAnalyticsListener(fn: Listener | null): void {
  listener = fn;
}

export function emitTutorialEvent(event: TutorialAnalyticsEvent): void {
  listener?.(event);
}
