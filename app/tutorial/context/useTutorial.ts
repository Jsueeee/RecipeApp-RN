import { useContext } from "react";
import { TutorialContext, type TutorialContextValue } from "./TutorialContext";

export function useTutorial(): TutorialContextValue {
  const ctx = useContext(TutorialContext);
  if (!ctx) {
    throw new Error(
      "useTutorial must be used within a <TutorialProvider>. " +
        "Wrap your app root in app/_layout.tsx with TutorialProvider.",
    );
  }
  return ctx;
}
