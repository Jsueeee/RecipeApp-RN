import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const COMPLETED_KEY = "tutorial_v2_completed";
const PROGRESS_KEY = "tutorial_v2_progress";

type Status = "loading" | "should-start" | "skip";

export type UseFirstLaunchResult = {
  status: Status;
  resumeStepIndex: number | null;
  markCompleted: () => Promise<void>;
  saveProgress: (stepIndex: number) => Promise<void>;
  resetForReplay: () => Promise<void>;
};

export function useFirstLaunch(): UseFirstLaunchResult {
  const [status, setStatus] = useState<Status>("loading");
  const [resumeStepIndex, setResumeStepIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [completed, progress] = await Promise.all([
          AsyncStorage.getItem(COMPLETED_KEY),
          AsyncStorage.getItem(PROGRESS_KEY),
        ]);
        if (cancelled) return;
        if (completed === "1") {
          setStatus("skip");
          return;
        }
        if (progress) {
          const parsed = Number.parseInt(progress, 10);
          if (Number.isFinite(parsed) && parsed > 0) {
            setResumeStepIndex(parsed);
          }
        }
        setStatus("should-start");
      } catch {
        if (!cancelled) setStatus("should-start");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markCompleted = useCallback(async () => {
    try {
      await AsyncStorage.multiSet([
        [COMPLETED_KEY, "1"],
        [PROGRESS_KEY, ""],
      ]);
    } catch {
      // best effort — non-fatal
    }
  }, []);

  const saveProgress = useCallback(async (stepIndex: number) => {
    try {
      await AsyncStorage.setItem(PROGRESS_KEY, String(stepIndex));
    } catch {
      // best effort
    }
  }, []);

  const resetForReplay = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([COMPLETED_KEY, PROGRESS_KEY]);
      setResumeStepIndex(null);
      setStatus("should-start");
    } catch {
      // best effort
    }
  }, []);

  return { status, resumeStepIndex, markCompleted, saveProgress, resetForReplay };
}
