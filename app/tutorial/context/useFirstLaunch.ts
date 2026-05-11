import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const COMPLETED_KEY = "tutorial_v2_completed";
const PROGRESS_KEY = "tutorial_v2_progress";

// ⚠️ TEMP: 테스트용 — 매 cold start마다 무조건 튜토리얼 띄움.
// 운영 배포 전에 반드시 false로 되돌릴 것.
const FORCE_TUTORIAL = true;

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
      if (FORCE_TUTORIAL) {
        // 테스트 모드: 저장된 완료/진행 상태 무시하고 처음부터 시작
        try {
          await AsyncStorage.multiRemove([COMPLETED_KEY, PROGRESS_KEY]);
        } catch {
          // ignore
        }
        if (!cancelled) {
          setResumeStepIndex(null);
          setStatus("should-start");
        }
        return;
      }
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
    if (FORCE_TUTORIAL) return;
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
    if (FORCE_TUTORIAL) return;
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
