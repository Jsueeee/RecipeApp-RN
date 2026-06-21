import { STEPS, TOTAL_STEPS } from "./steps";
import type { EngineEvent, EngineState, Rect } from "./types";

const RECT_EPSILON = 0.5;

export const initialEngineState: EngineState = {
  phase: "idle",
  stepIndex: 0,
  anchors: {},
  hasStarted: false,
};

export function engineReducer(
  state: EngineState,
  event: EngineEvent,
): EngineState {
  switch (event.type) {
    case "START": {
      if (state.hasStarted && state.phase !== "done") return state;
      const stepIndex = Math.min(
        Math.max(event.stepIndex ?? 0, 0),
        TOTAL_STEPS - 1,
      );
      return {
        ...state,
        phase: "entering",
        stepIndex,
        hasStarted: true,
      };
    }

    case "ANCHOR_MEASURED": {
      const prev = state.anchors[event.id];
      if (prev && areRectsClose(prev, event.rect)) {
        return state;
      }
      return {
        ...state,
        anchors: { ...state.anchors, [event.id]: event.rect },
      };
    }

    case "ANCHOR_REMOVED": {
      if (!(event.id in state.anchors)) return state;
      const next = { ...state.anchors };
      delete next[event.id];
      return { ...state, anchors: next };
    }

    case "ENTRANCE_COMPLETE": {
      if (state.phase !== "entering") return state;
      return { ...state, phase: "waiting" };
    }

    case "CTA_PRESSED": {
      if (state.phase !== "waiting") return state;
      const step = STEPS[state.stepIndex];
      if (step?.trigger.type !== "cta") return state;
      return { ...state, phase: "success" };
    }

    case "SCREEN_TAPPED": {
      if (state.phase !== "waiting") return state;
      const step = STEPS[state.stepIndex];
      if (step?.trigger.type !== "auto-or-tap") return state;
      return { ...state, phase: "success" };
    }

    case "ANCHOR_TAPPED": {
      if (state.phase !== "waiting") return state;
      const step = STEPS[state.stepIndex];
      if (!step || step.anchorId !== event.id) return state;
      if (
        step.trigger.type !== "tap-anchor" &&
        step.trigger.type !== "navigation"
      ) {
        return state;
      }
      return { ...state, phase: "success" };
    }

    case "NAV_MATCHED": {
      if (state.phase !== "waiting") return state;
      const step = STEPS[state.stepIndex];
      if (!step) return state;
      const matchesPrimary =
        step.trigger.type === "navigation" &&
        step.trigger.segmentMatch === event.segment;
      const matchesSecondary =
        step.advanceOnSegment !== undefined &&
        step.advanceOnSegment === event.segment;
      if (!matchesPrimary && !matchesSecondary) return state;
      return { ...state, phase: "success" };
    }

    case "AUTO_TIMEOUT": {
      if (state.phase !== "waiting") return state;
      const step = STEPS[state.stepIndex];
      if (
        step?.trigger.type !== "auto" &&
        step?.trigger.type !== "auto-or-tap"
      ) {
        return state;
      }
      return { ...state, phase: "success" };
    }

    case "SHEET_DISMISSED": {
      if (state.phase !== "waiting") return state;
      const step = STEPS[state.stepIndex];
      if (step?.trigger.type !== "sheet-dismiss") return state;
      return { ...state, phase: "success" };
    }

    case "PROGRESS_REPORTED": {
      if (state.phase !== "waiting") return state;
      const step = STEPS[state.stepIndex];
      if (
        step?.trigger.type !== "progress" ||
        step.trigger.key !== event.key
      ) {
        return state;
      }
      return { ...state, phase: "success" };
    }

    case "EXIT_COMPLETE": {
      if (state.phase !== "success") return state;
      const next = state.stepIndex + 1;
      if (next >= TOTAL_STEPS) {
        return { ...state, phase: "done" };
      }
      return { ...state, stepIndex: next, phase: "entering" };
    }

    case "SKIP": {
      if (state.phase === "done" || state.phase === "idle") return state;
      return { ...state, phase: "done" };
    }

    case "RESTART": {
      return {
        phase: "entering",
        stepIndex: 0,
        anchors: state.anchors,
        hasStarted: true,
      };
    }

    default:
      return state;
  }
}

function areRectsClose(a: Rect, b: Rect): boolean {
  return (
    Math.abs(a.x - b.x) < RECT_EPSILON &&
    Math.abs(a.y - b.y) < RECT_EPSILON &&
    Math.abs(a.width - b.width) < RECT_EPSILON &&
    Math.abs(a.height - b.height) < RECT_EPSILON
  );
}
