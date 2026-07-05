import {
  getFirebaseScreenName,
  logFirebaseScreenView,
  logTutorialAnalyticsEvent,
} from "@/app/lib/analytics/firebaseAnalytics";
import { setTutorialAnalyticsListener } from "@/app/tutorial";
import { useSegments } from "expo-router";
import { useEffect, useRef } from "react";

export function FirebaseAnalyticsTracker() {
  const segments = useSegments();
  const screenName = getFirebaseScreenName(segments);
  const previousScreenNameRef = useRef<string | null>(null);

  useEffect(() => {
    if (previousScreenNameRef.current === screenName) {
      return;
    }

    previousScreenNameRef.current = screenName;
    void logFirebaseScreenView(screenName);
  }, [screenName]);

  useEffect(() => {
    setTutorialAnalyticsListener((event) => {
      void logTutorialAnalyticsEvent(event);
    });

    return () => {
      setTutorialAnalyticsListener(null);
    };
  }, []);

  return null;
}
