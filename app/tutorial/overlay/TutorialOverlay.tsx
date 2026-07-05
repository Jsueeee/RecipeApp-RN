import { DebouncedPressable } from "@/app/components/DebouncedPressable";
import { ChoiceDialog } from "@/components/ChoiceDialog";
import { CTAButton } from "@/components/CTAButton";
import { selection as hapticSelection } from "@/app/lib/haptics";
import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  FadeIn,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CHARACTER_BODY_H,
  CHARACTER_BODY_W,
  TomatoCharacter,
} from "../character/TomatoCharacter";
import { SparkleBurst } from "../character/SparkleBurst";
import { useTutorial } from "../context/useTutorial";
import type { AnchorId, CharacterRegion, Rect } from "../engine/types";
import { SpeechBubble } from "../tooltip/SpeechBubble";
import { Spotlight } from "./Spotlight";
import { TouchGate } from "./TouchGate";

const GUEST_CHOICE_POP_DELAY_MS = 140;
const GUEST_FEATURE_ROLL_VISIBLE_COUNT = 3;
const GUEST_FEATURE_ROLL_ITEM_HEIGHT = 34;
const GUEST_FEATURE_ROLL_HEIGHT =
  GUEST_FEATURE_ROLL_VISIBLE_COUNT * GUEST_FEATURE_ROLL_ITEM_HEIGHT;
const GUEST_FEATURE_ROLL_INTERVAL_MS = 1900;
const GUEST_FEATURE_ROLL_TRANSITION_MS = 360;
const GUEST_CHOICE_BUTTON_HEIGHT = 52;
const GUEST_CHOICE_STACK_GAP = 10;
const SPEECH_LINE_HEIGHT = 28;

export function TutorialOverlay() {
  const [skipDialogVisible, setSkipDialogVisible] = useState(false);
  const [guestChoiceReadyStep, setGuestChoiceReadyStep] = useState<
    number | null
  >(null);
  const {
    state,
    currentStep,
    totalSteps,
    currentAnchorRect,
    coordinateSpaceSize,
    advanceCta,
    advanceScreenTap,
    skip,
    reportAnchorTap,
    reportSpeechComplete,
    triggerAnchorAction,
    continueGuestTutorial,
    goToLoginFromTutorial,
  } = useTutorial();
  const insets = useSafeAreaInsets();
  const windowDimensions = useWindowDimensions();
  const screenW = coordinateSpaceSize.width || windowDimensions.width;
  const screenH = coordinateSpaceSize.height || windowDimensions.height;
  const currentStepId = currentStep?.id;
  const currentStepTriggerType = currentStep?.trigger.type;
  const proxyAnchorId =
    state.phase === "waiting" &&
    currentAnchorRect &&
    currentStep?.anchorId &&
    (currentStep.trigger.type === "tap-anchor" ||
      currentStep.trigger.type === "navigation" ||
      currentStep.trigger.type === "progress")
      ? currentStep.anchorId
      : null;
  const guestChoiceOpacity = useSharedValue(0);
  const guestChoiceScale = useSharedValue(0.96);
  const guestChoiceTranslateY = useSharedValue(8);

  useEffect(() => {
    setGuestChoiceReadyStep(null);
    guestChoiceOpacity.value = 0;
    guestChoiceScale.value = 0.96;
    guestChoiceTranslateY.value = 8;
  }, [
    currentStepId,
    state.stepIndex,
    guestChoiceOpacity,
    guestChoiceScale,
    guestChoiceTranslateY,
  ]);

  useEffect(() => {
    if (
      state.phase !== "waiting" ||
      currentStepTriggerType !== "guest-mode-choice" ||
      guestChoiceReadyStep !== state.stepIndex
    ) {
      return;
    }

    const timer = setTimeout(() => {
      guestChoiceOpacity.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.quad),
      });
      guestChoiceScale.value = withSpring(1, {
        damping: 9,
        stiffness: 180,
        mass: 0.7,
      });
      guestChoiceTranslateY.value = withSpring(0, {
        damping: 11,
        stiffness: 190,
        mass: 0.75,
      });
    }, GUEST_CHOICE_POP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [
    currentStepTriggerType,
    guestChoiceOpacity,
    guestChoiceReadyStep,
    guestChoiceScale,
    guestChoiceTranslateY,
    state.phase,
    state.stepIndex,
  ]);

  const guestChoiceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: guestChoiceOpacity.value,
    transform: [
      { translateY: guestChoiceTranslateY.value },
      { scale: guestChoiceScale.value },
    ],
  }));

  const visible = state.phase !== "idle" && state.phase !== "done";
  if (!visible || !currentStep) return null;

  const showCta = currentStep.trigger.type === "cta";
  const showGuestChoice = currentStep.trigger.type === "guest-mode-choice";
  const advanceOnScreenTap = currentStep.trigger.type === "auto-or-tap";
  const ctaLabel =
    currentStep.trigger.type === "cta" ? currentStep.trigger.label : "";
  const loginChoiceLabel =
    currentStep.trigger.type === "guest-mode-choice"
      ? currentStep.trigger.loginLabel
      : "";
  const continueChoiceLabel =
    currentStep.trigger.type === "guest-mode-choice"
      ? currentStep.trigger.continueLabel
      : "";
  const unavailableFeatures =
    currentStep.trigger.type === "guest-mode-choice"
      ? (currentStep.trigger.unavailableFeatures ?? [])
      : [];
  const hasUnavailableFeatures = unavailableFeatures.length > 0;

  const charPos = regionToPosition(
    currentStep.character.region,
    currentAnchorRect,
    currentStep.anchorId,
    screenW,
    screenH,
    insets.top,
    insets.bottom,
  );

  const tooltipVisible = state.phase === "waiting";
  const stepIndex = state.stepIndex;
  const isLastStep = stepIndex === totalSteps - 1;
  const spotlightRect = applySpotlightInsets(
    currentAnchorRect,
    currentStep.spotlightHorizontalInset,
    currentStep.spotlightVerticalInset,
  );
  const activeSpotlightRect =
    state.phase === "success" ? null : (spotlightRect ?? null);
  const anchorCenter = currentAnchorRect
    ? {
        x: currentAnchorRect.x + currentAnchorRect.width / 2,
        y: currentAnchorRect.y + currentAnchorRect.height / 2,
      }
    : null;

  const charCenterX = charPos.left + CHARACTER_BODY_W / 2;
  const charCenterY = charPos.top + CHARACTER_BODY_H / 2;
  const bubbleAboveChar = charPos.top + CHARACTER_BODY_H > screenH * 0.5;
  const estimatedSpeechLineCount = estimateSpeechLineCount(
    currentStep.speech ?? "",
    screenW,
  );
  const estimatedSpeechHeight = estimatedSpeechLineCount * SPEECH_LINE_HEIGHT;
  const speechBlockBottom = currentStep.speech
    ? bubbleAboveChar
      ? charPos.top - 24
      : charPos.top + CHARACTER_BODY_H + 24 + estimatedSpeechHeight
    : charPos.top + CHARACTER_BODY_H + 24;
  const guestChoiceStackHeight =
    GUEST_CHOICE_BUTTON_HEIGHT * 2 +
    GUEST_CHOICE_STACK_GAP +
    (hasUnavailableFeatures
      ? GUEST_FEATURE_ROLL_HEIGHT + GUEST_CHOICE_STACK_GAP
      : 0);
  const minGuestChoiceTop = insets.top + 96;
  const maxGuestChoiceTop =
    screenH - insets.bottom - guestChoiceStackHeight - 32;
  const guestChoiceTop = Math.max(
    minGuestChoiceTop,
    Math.min(maxGuestChoiceTop, speechBlockBottom + 18),
  );

  return (
    <>
      {/* Visual layer. Touch blocking is handled by the interaction layer so
          the dimmed area never leaks taps to the screen underneath. */}
      <Animated.View
        pointerEvents="none"
        entering={FadeIn.duration(280)}
        style={[StyleSheet.absoluteFill, styles.visualLayer]}
      >
        <Spotlight
          key={`spotlight-${currentStep.id}`}
          rect={activeSpotlightRect}
          isSuccess={state.phase === "success"}
          shape={currentStep.spotlightShape}
          padding={currentStep.spotlightPadding}
          viewportWidth={screenW}
          viewportHeight={screenH}
        />

        {stepIndex === 0 ? (
          <SparkleBurst
            cx={charCenterX}
            cy={charCenterY + 6}
            count={10}
            distance={76}
            durationMs={860}
            triggerKey={`entrance-${stepIndex}`}
          />
        ) : null}

        {anchorCenter && state.phase === "success" ? (
          <SparkleBurst
            cx={anchorCenter.x}
            cy={anchorCenter.y}
            count={7}
            distance={54}
            durationMs={620}
            triggerKey={`touch-success-${stepIndex}`}
            size={16}
            lift={0}
          />
        ) : null}

        {isLastStep ? (
          <>
            <SparkleBurst
              cx={charCenterX}
              cy={charCenterY}
              count={12}
              distance={130}
              durationMs={1200}
              triggerKey={`finale-a-${stepIndex}`}
            />
            <SparkleBurst
              cx={charCenterX}
              cy={charCenterY}
              count={8}
              distance={70}
              durationMs={900}
              triggerKey={`finale-b-${stepIndex}`}
              size={18}
            />
          </>
        ) : null}

        <TomatoCharacter
          position={charPos}
          emotion={currentStep.character.emotion}
          phase={state.phase}
        />

        {currentStep.speech ? (
          <View
            pointerEvents="none"
            style={[
              styles.bubbleWrap,
              bubbleAboveChar
                ? { bottom: screenH - charPos.top + 24 }
                : { top: charPos.top + CHARACTER_BODY_H + 24 },
            ]}
          >
            <SpeechBubble
              key={`bubble-${stepIndex}`}
              text={currentStep.speech}
              visible={tooltipVisible}
              showAfterDelayMs={350}
              charDelayMs={28}
              onComplete={() => {
                reportSpeechComplete(stepIndex);
                if (showGuestChoice) {
                  setGuestChoiceReadyStep(stepIndex);
                }
              }}
            />
          </View>
        ) : null}
      </Animated.View>

      {/* Interaction layer — blocks dimmed areas, keeps active target + skip tappable. */}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <TouchGate rect={spotlightRect ?? null} />

        {advanceOnScreenTap && state.phase === "waiting" ? (
          <DebouncedPressable
            onPress={() => {
              hapticSelection();
              advanceScreenTap();
            }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        {proxyAnchorId && currentAnchorRect ? (
          <DebouncedPressable
            onPress={() => {
              if (
                currentStep.trigger.type === "tap-anchor" ||
                currentStep.trigger.type === "navigation"
              ) {
                reportAnchorTap(proxyAnchorId);
              }
              triggerAnchorAction(proxyAnchorId);
            }}
            style={{
              position: "absolute",
              left: currentAnchorRect.x,
              top: currentAnchorRect.y,
              width: currentAnchorRect.width,
              height: currentAnchorRect.height,
            }}
          />
        ) : null}

        {showCta ? (
          <View
            pointerEvents="box-none"
            style={[styles.ctaWrap, { bottom: insets.bottom + 36 }]}
          >
            <DebouncedPressable
              onPress={() => {
                hapticSelection();
                advanceCta();
              }}
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
            >
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </DebouncedPressable>
          </View>
        ) : null}

        <DebouncedPressable
          onPress={() => {
            hapticSelection();
            setSkipDialogVisible(true);
          }}
          hitSlop={12}
          style={[styles.skipBtn, { top: insets.top + 8 }]}
        >
          <Text style={styles.skipText}>건너뛰기</Text>
        </DebouncedPressable>

        {showGuestChoice &&
        state.phase === "waiting" &&
        guestChoiceReadyStep === stepIndex ? (
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.guestChoiceButtons,
              { top: guestChoiceTop },
              guestChoiceAnimatedStyle,
            ]}
          >
            {unavailableFeatures.length > 0 ? (
              <GuestFeatureRoller features={unavailableFeatures} />
            ) : null}

            <View style={styles.guestChoiceButton}>
              <CTAButton
                buttonLabel={loginChoiceLabel}
                onPress={() => {
                  hapticSelection();
                  goToLoginFromTutorial();
                }}
                className="w-[200px]"
              />
            </View>

            <View style={styles.guestChoiceButton}>
              <CTAButton
                buttonLabel={continueChoiceLabel}
                variant="cancel"
                onPress={() => {
                  hapticSelection();
                  continueGuestTutorial();
                }}
                className="w-[200px]"
              />
            </View>
          </Animated.View>
        ) : null}

        <ChoiceDialog
          visible={skipDialogVisible}
          title="튜토리얼을 그만볼까요?"
          message="지금 종료하면 튜토리얼이 끝난 것으로 처리돼요."
          cancelText="계속 보기"
          confirmText="끝내기"
          onCancel={() => setSkipDialogVisible(false)}
          onConfirm={() => {
            setSkipDialogVisible(false);
            skip();
          }}
        />
      </View>
    </>
  );
}

function GuestFeatureRoller({ features }: { features: readonly string[] }) {
  const offsetY = useSharedValue(0);
  const displayFeatures = useMemo(
    () => createLoopedFeatureList(features),
    [features],
  );

  useEffect(() => {
    offsetY.value = 0;
    if (features.length <= 1) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex += 1;
      const targetIndex = currentIndex;
      offsetY.value = withTiming(
        -GUEST_FEATURE_ROLL_ITEM_HEIGHT * targetIndex,
        {
          duration: GUEST_FEATURE_ROLL_TRANSITION_MS,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished && targetIndex === features.length) {
            offsetY.value = 0;
          }
        },
      );

      if (currentIndex === features.length) {
        currentIndex = 0;
      }
    }, GUEST_FEATURE_ROLL_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      cancelAnimation(offsetY);
    };
  }, [features, offsetY]);

  const rollStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

  return (
    <View style={styles.guestFeatureBlock}>
      <View style={styles.guestFeatureRoller}>
        <Animated.View style={rollStyle}>
          {displayFeatures.map((feature, index) => (
            <GuestFeatureRollerItem
              key={`${feature}-${index}`}
              feature={feature}
              index={index}
              offsetY={offsetY}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

function GuestFeatureRollerItem({
  feature,
  index,
  offsetY,
}: {
  feature: string;
  index: number;
  offsetY: SharedValue<number>;
}) {
  const itemStyle = useAnimatedStyle(() => {
    const focus = getGuestFeatureFocus(index, offsetY.value);

    return {
      opacity: interpolate(focus, [0, 1], [0.46, 1], Extrapolation.CLAMP),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const focus = getGuestFeatureFocus(index, offsetY.value);

    return {
      color: interpolateColor(
        focus,
        [0, 1],
        ["rgba(255, 255, 255, 0.74)", "#8AF1D5"],
      ),
      textShadowColor: interpolateColor(
        focus,
        [0, 1],
        ["rgba(0, 0, 0, 0.72)", "rgba(75, 210, 176, 0.32)"],
      ),
      textShadowRadius: interpolate(focus, [0, 1], [7, 10]),
    };
  });

  return (
    <Animated.View style={[styles.guestFeatureItem, itemStyle]}>
      <Animated.Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        style={[styles.guestFeatureText, textStyle]}
      >
        {feature}
      </Animated.Text>
    </Animated.View>
  );
}

function getGuestFeatureFocus(index: number, offsetY: number): number {
  "worklet";

  const distanceFromCenter = Math.abs(
    index + offsetY / GUEST_FEATURE_ROLL_ITEM_HEIGHT - 1,
  );

  return interpolate(
    distanceFromCenter,
    [0, 1],
    [1, 0],
    Extrapolation.CLAMP,
  );
}

function createLoopedFeatureList(features: readonly string[]): string[] {
  if (features.length === 0) return [];
  if (features.length === 1) return [...features];

  const repeated = [...features];
  const targetLength = features.length + GUEST_FEATURE_ROLL_VISIBLE_COUNT;
  while (repeated.length < targetLength) {
    repeated.push(features[repeated.length % features.length]);
  }
  return repeated;
}

function estimateSpeechLineCount(text: string, screenW: number): number {
  if (!text) return 1;

  const charsPerLine = screenW < 360 ? 15 : 18;
  return text
    .split("\n")
    .reduce(
      (lineCount, line) =>
        lineCount +
        Math.max(1, Math.ceil(Array.from(line).length / charsPerLine)),
      0,
    );
}

function applySpotlightInsets(
  rect: Rect | undefined,
  horizontalInset: number | undefined,
  verticalInset: number | undefined,
): Rect | undefined {
  if (!rect || (!horizontalInset && !verticalInset)) return rect;

  const safeHorizontalInset = Math.min(horizontalInset ?? 0, rect.width / 2);
  const safeVerticalInset = Math.min(verticalInset ?? 0, rect.height / 2);
  return {
    ...rect,
    x: rect.x + safeHorizontalInset,
    y: rect.y + safeVerticalInset,
    width: rect.width - safeHorizontalInset * 2,
    height: rect.height - safeVerticalInset * 2,
  };
}

function regionToPosition(
  region: CharacterRegion,
  anchor: Rect | undefined,
  anchorId: AnchorId | undefined,
  screenW: number,
  screenH: number,
  insetsTop: number,
  insetsBottom: number,
): { left: number; top: number } {
  const W = CHARACTER_BODY_W;
  const H = CHARACTER_BODY_H;
  const safeTop = insetsTop + 56;
  const safeBottom = insetsBottom + 160;

  switch (region) {
    case "top-left":
      return { left: 28, top: safeTop };
    case "top-right":
      return { left: screenW - W - 28, top: safeTop };
    case "bottom-left":
      return { left: 28, top: screenH - H - safeBottom };
    case "bottom-right":
      return { left: screenW - W - 28, top: screenH - H - safeBottom };
    case "center":
      return { left: screenW / 2 - W / 2, top: screenH * 0.32 };
    case "beside-anchor":
    default: {
      if (!anchor) {
        return { left: screenW / 2 - W / 2, top: screenH * 0.32 };
      }
      const placeRight = anchor.x + anchor.width / 2 < screenW * 0.55;
      const gap =
        anchorId === "picker-ingredient-first" ||
        anchorId === "picker-ingredient-second"
          ? 44
          : 18;
      const left = placeRight
        ? Math.min(anchor.x + anchor.width + gap, screenW - W - 16)
        : Math.max(anchor.x - W - gap, 16);
      const top = Math.max(
        safeTop,
        Math.min(
          anchor.y + anchor.height / 2 - H / 2,
          screenH - H - safeBottom,
        ),
      );
      return { left, top };
    }
  }
}

const styles = StyleSheet.create({
  skipBtn: {
    position: "absolute",
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skipText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    fontFamily: "pretendard_medium",
  },
  ctaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cta: {
    paddingHorizontal: 36,
    paddingVertical: 15,
    borderRadius: 999,
    backgroundColor: "#4BD2B0",
    shadowColor: "#4BD2B0",
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  ctaPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.92,
  },
  ctaText: {
    color: "white",
    fontSize: 16,
    fontFamily: "pretendard_bold",
  },
  guestChoiceButtons: {
    position: "absolute",
    left: 24,
    right: 24,
    alignItems: "center",
    gap: GUEST_CHOICE_STACK_GAP,
  },
  guestChoiceButton: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  guestFeatureBlock: {
    width: "100%",
    maxWidth: 370,
    alignItems: "center",
  },
  guestFeatureRoller: {
    width: "100%",
    height: GUEST_FEATURE_ROLL_HEIGHT,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  guestFeatureItem: {
    height: GUEST_FEATURE_ROLL_ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  guestFeatureText: {
    flexShrink: 1,
    color: "rgba(255, 255, 255, 0.74)",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "pretendard_bold",
    includeFontPadding: false,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.72)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 7,
  },
  bubbleWrap: {
    position: "absolute",
    left: 24,
    right: 24,
    alignItems: "center",
  },
  visualLayer: {
    overflow: "visible",
  },
});
