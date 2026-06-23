import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TutorialMode } from "../engine/steps";

const COMPLETED_KEY = "tutorial_v2_completed";
const PROGRESS_KEY = "tutorial_v2_progress";
const GUEST_COMPLETED_KEY = "tutorial_v2_guest_completed";
const GUEST_PROGRESS_KEY = "tutorial_v2_guest_progress";
const EXPIRATION_NOTIFICATION_TUTORIAL_COMPLETED_KEY =
  "tutorial_v2_expiration_notification_completed";

type Status = "loading" | "should-start" | "skip";
type CompletionStatus = "loading" | "pending" | "completed";

export type UseFirstLaunchResult = {
  status: Status;
  resumeStepIndex: number | null;
  markCompleted: () => Promise<void>;
  saveProgress: (stepIndex: number) => Promise<void>;
  resetForReplay: () => Promise<void>;
};

export type UseExpirationNotificationTutorialResult = {
  status: CompletionStatus;
  markCompleted: () => Promise<void>;
  resetForReplay: () => Promise<void>;
};

const getStorageKeys = (mode: TutorialMode) =>
  mode === "authenticated"
    ? {
        completedKey: COMPLETED_KEY,
        completedKeys: [COMPLETED_KEY, GUEST_COMPLETED_KEY],
        progressKey: PROGRESS_KEY,
      }
    : {
        completedKey: GUEST_COMPLETED_KEY,
        completedKeys: [GUEST_COMPLETED_KEY],
        progressKey: GUEST_PROGRESS_KEY,
      };

export function useFirstLaunch(
  mode: TutorialMode | null,
): UseFirstLaunchResult {
  const [status, setStatus] = useState<Status>("loading");
  const [resumeStepIndex, setResumeStepIndex] = useState<number | null>(null);
  const storageKeys = useMemo(
    () => (mode ? getStorageKeys(mode) : null),
    [mode],
  );

  useEffect(() => {
    setStatus("loading");
    setResumeStepIndex(null);
    if (!storageKeys) return;

    let cancelled = false;
    (async () => {
      try {
        const [completedEntries, progress] = await Promise.all([
          AsyncStorage.multiGet(storageKeys.completedKeys),
          AsyncStorage.getItem(storageKeys.progressKey),
        ]);
        if (cancelled) return;
        if (completedEntries.some(([, completed]) => completed === "1")) {
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
  }, [storageKeys]);

  const markCompleted = useCallback(async () => {
    if (!storageKeys) return;

    try {
      await AsyncStorage.multiSet([
        [storageKeys.completedKey, "1"],
        [storageKeys.progressKey, ""],
      ]);
    } catch {
      // best effort — non-fatal
    }
  }, [storageKeys]);

  const saveProgress = useCallback(async (stepIndex: number) => {
    if (!storageKeys) return;

    try {
      await AsyncStorage.setItem(storageKeys.progressKey, String(stepIndex));
    } catch {
      // best effort
    }
  }, [storageKeys]);

  const resetForReplay = useCallback(async () => {
    if (!storageKeys) return;

    try {
      await AsyncStorage.multiRemove([
        ...storageKeys.completedKeys,
        storageKeys.progressKey,
      ]);
      setResumeStepIndex(null);
      setStatus("should-start");
    } catch {
      // best effort
    }
  }, [storageKeys]);

  return { status, resumeStepIndex, markCompleted, saveProgress, resetForReplay };
}

export function useExpirationNotificationTutorial(): UseExpirationNotificationTutorialResult {
  const [status, setStatus] = useState<CompletionStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const completed = await AsyncStorage.getItem(
          EXPIRATION_NOTIFICATION_TUTORIAL_COMPLETED_KEY,
        );

        if (!cancelled) {
          setStatus(completed === "1" ? "completed" : "pending");
        }
      } catch {
        if (!cancelled) setStatus("pending");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const markCompleted = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        EXPIRATION_NOTIFICATION_TUTORIAL_COMPLETED_KEY,
        "1",
      );
    } catch {
      // best effort — non-fatal
    } finally {
      setStatus("completed");
    }
  }, []);

  const resetForReplay = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(
        EXPIRATION_NOTIFICATION_TUTORIAL_COMPLETED_KEY,
      );
    } catch {
      // best effort
    } finally {
      setStatus("pending");
    }
  }, []);

  return { status, markCompleted, resetForReplay };
}
