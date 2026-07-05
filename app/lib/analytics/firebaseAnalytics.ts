import type {
  CustomEventName,
  ScreenViewParameters,
} from "@react-native-firebase/analytics";
import type { TutorialAnalyticsEvent } from "@/app/tutorial";

type AnalyticsModule = typeof import("@react-native-firebase/analytics");
type AnalyticsParamValue = string | number | boolean;
type AnalyticsParams = Record<
  string,
  AnalyticsParamValue | readonly AnalyticsParamValue[] | null | undefined
>;

let analyticsModule: AnalyticsModule | null | undefined;

function getAnalyticsModule(): AnalyticsModule | null {
  if (analyticsModule !== undefined) {
    return analyticsModule;
  }

  try {
    analyticsModule =
      require("@react-native-firebase/analytics") as AnalyticsModule;
  } catch (error) {
    analyticsModule = null;

    if (__DEV__) {
      console.warn("Firebase Analytics is not available.", error);
    }
  }

  return analyticsModule;
}

function cleanParams(
  params?: AnalyticsParams,
): Record<string, unknown> | undefined {
  if (!params) {
    return undefined;
  }

  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null),
  );

  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

function warnAnalyticsError(action: string, error: unknown) {
  if (__DEV__) {
    console.warn(`Firebase Analytics ${action} failed.`, error);
  }
}

function getTutorialModeParam(mode: TutorialAnalyticsEvent["mode"]) {
  return mode.replace(/-/g, "_");
}

function getTutorialAccountType(mode: TutorialAnalyticsEvent["mode"]) {
  return mode === "guest" ? "guest" : "logged_in";
}

function getTutorialBaseParams(
  event: TutorialAnalyticsEvent,
): AnalyticsParams {
  return {
    tutorial_mode: getTutorialModeParam(event.mode),
    account_type: getTutorialAccountType(event.mode),
    total_steps: event.totalSteps,
  };
}

export function getFirebaseScreenName(segments: readonly string[]): string {
  const rawName = segments.length > 0 ? segments.join("/") : "root";
  const screenName = rawName
    .replace(/\[([^\]]+)\]/g, "$1")
    .replace(/[^A-Za-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return screenName || "root";
}

export async function logFirebaseScreenView(screenName: string): Promise<void> {
  const module = getAnalyticsModule();

  if (!module) {
    return;
  }

  const params: ScreenViewParameters = {
    screen_name: screenName,
    screen_class: screenName,
  };

  try {
    await module.logScreenView(module.getAnalytics(), params);
  } catch (error) {
    warnAnalyticsError("screen view logging", error);
  }
}

export async function logFirebaseAnalyticsEvent<T extends string>(
  name: CustomEventName<T>,
  params?: AnalyticsParams,
): Promise<void> {
  const module = getAnalyticsModule();

  if (!module) {
    return;
  }

  try {
    await module.logEvent(module.getAnalytics(), name, cleanParams(params));
  } catch (error) {
    warnAnalyticsError(`event logging (${name})`, error);
  }
}

export function logTutorialAnalyticsEvent(
  event: TutorialAnalyticsEvent,
): Promise<void> {
  const baseParams = getTutorialBaseParams(event);

  switch (event.type) {
    case "tutorial_started":
      return logFirebaseAnalyticsEvent(event.type, {
        ...baseParams,
        start_step: event.startStep,
        start_step_index: event.startStepIndex,
      });
    case "tutorial_step_shown":
      return logFirebaseAnalyticsEvent(event.type, {
        ...baseParams,
        step_id: event.stepId,
        step_index: event.stepIndex,
      });
    case "tutorial_step_advanced":
      return logFirebaseAnalyticsEvent(event.type, {
        ...baseParams,
        step_id: event.stepId,
        step_index: event.stepIndex,
        method: event.method,
      });
    case "tutorial_skipped":
      return logFirebaseAnalyticsEvent(event.type, {
        ...baseParams,
        at_step: event.atStep,
        at_step_index: event.atStepIndex,
        skip_reason: event.reason,
      });
    case "tutorial_completed":
      return logFirebaseAnalyticsEvent(event.type, {
        ...baseParams,
        final_step: event.finalStep,
        final_step_index: event.finalStepIndex,
      });
    case "tutorial_finished":
      return logFirebaseAnalyticsEvent(event.type, {
        ...baseParams,
        outcome: event.outcome,
        final_step: event.finalStep,
        final_step_index: event.finalStepIndex,
        skip_reason: event.skipReason,
      });
    case "tutorial_anchor_timeout":
      return logFirebaseAnalyticsEvent(event.type, {
        ...baseParams,
        anchor_id: event.anchorId,
      });
  }
}
