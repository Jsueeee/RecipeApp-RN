export type AnchorId =
  | "fab-add-ingredient"
  | "tab-fridge"
  | "tab-recipe"
  | "tab-search"
  | "tab-myPage"
  | "fridge-basket-first-ingredient"
  | "fridge-basket-save"
  | "picker-categories"
  | "picker-custom"
  | "picker-ingredient-first"
  | "picker-ingredient-second"
  | "picker-cta"
  | "search-popular-keyword"
  | "search-result-source-tabs"
  | "my-recipe-create";

export type StepId =
  | "entrance"
  | "tap-fab"
  | "picker-intro"
  | "picker-pick"
  | "picker-pick-next"
  | "picker-custom"
  | "picker-confirm"
  | "back-cheer"
  | "basket-edit-hint"
  | "fridge-save"
  | "recipe-tab-quest"
  | "search-tab-quest"
  | "search-popular-quest"
  | "search-result-intro"
  | "my-tab-quest"
  | "my-page-intro"
  | "celebration"
  | "guest-entrance"
  | "guest-login-choice"
  | "guest-mode-start"
  | "guest-picker-intro"
  | "guest-picker-confirm"
  | "guest-back-cheer"
  | "guest-basket-edit-hint"
  | "guest-fridge-save"
  | "guest-recipe-intro"
  | "guest-search-tab-quest"
  | "guest-search-popular-quest"
  | "guest-search-result-intro"
  | "guest-my-tab-quest"
  | "guest-my-page-intro"
  | "guest-celebration"
  | "expiration-notification-intro";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Phase = "idle" | "entering" | "waiting" | "success" | "done";

export type CharacterEmotion =
  | "happy"
  | "pointing"
  | "cheering"
  | "taunting"
  | "celebrating"
  | "hidden";

export type CharacterRegion =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "beside-anchor";

export type StepTrigger =
  | { type: "auto"; delayMs: number }
  | { type: "auto-or-tap"; delayMs: number }
  | { type: "cta"; label: string }
  | {
      type: "guest-mode-choice";
      loginLabel: string;
      continueLabel: string;
      unavailableFeatures?: readonly string[];
    }
  | { type: "tap-anchor"; anchorId: AnchorId }
  | { type: "navigation"; segmentMatch: string }
  | { type: "sheet-dismiss" }
  | { type: "progress"; key: string };

export type SpotlightShape = "rect" | "circle";

export type StepConfig = {
  id: StepId;
  index: number;
  anchorId?: AnchorId;
  character: {
    emotion: CharacterEmotion;
    region: CharacterRegion;
  };
  speech?: string;
  trigger: StepTrigger;
  /**
   * Optional secondary fast-forward — if set, the step will also advance the
   * moment `useSegments()` includes this string, regardless of trigger type.
   * Useful when an `auto` step's content stops being relevant once the user
   * has already moved past the screen the speech describes.
   */
  advanceOnSegment?: string;
  /**
   * Spotlight hole shape. Defaults to "rect" (rounded rectangle). Use "circle"
   * for round buttons like the FAB so the highlight matches the button.
   */
  spotlightShape?: SpotlightShape;
  spotlightPadding?: number;
  spotlightHorizontalInset?: number;
  spotlightVerticalInset?: number;
  blocksTouches?: boolean;
};

export type EngineState = {
  phase: Phase;
  stepIndex: number;
  anchors: Partial<Record<AnchorId, Rect>>;
  hasStarted: boolean;
};

export type EngineEvent =
  | { type: "START"; stepIndex?: number; totalSteps: number }
  | { type: "ANCHOR_MEASURED"; id: AnchorId; rect: Rect }
  | { type: "ANCHOR_REMOVED"; id: AnchorId }
  | { type: "ENTRANCE_COMPLETE" }
  | { type: "CTA_PRESSED"; step: StepConfig | undefined }
  | { type: "GUEST_MODE_CONTINUED"; step: StepConfig | undefined }
  | { type: "SCREEN_TAPPED"; step: StepConfig | undefined }
  | { type: "ANCHOR_TAPPED"; id: AnchorId; step: StepConfig | undefined }
  | { type: "NAV_MATCHED"; segment: string; step: StepConfig | undefined }
  | { type: "AUTO_TIMEOUT"; step: StepConfig | undefined }
  | { type: "SHEET_DISMISSED"; step: StepConfig | undefined }
  | { type: "PROGRESS_REPORTED"; key: string; step: StepConfig | undefined }
  | { type: "EXIT_COMPLETE"; totalSteps: number }
  | { type: "SKIP" }
  | { type: "RESTART" };
