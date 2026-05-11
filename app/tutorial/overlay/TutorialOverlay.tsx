import { ChoiceDialog } from "@/components/ChoiceDialog";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CHARACTER_BODY_H,
  CHARACTER_BODY_W,
  TomatoCharacter,
} from "../character/TomatoCharacter";
import { SparkleBurst } from "../character/SparkleBurst";
import { useTutorial } from "../context/useTutorial";
import { STEPS, TOTAL_STEPS } from "../engine/steps";
import type { AnchorId, CharacterRegion, Rect } from "../engine/types";
import { SpeechBubble } from "../tooltip/SpeechBubble";
import { Spotlight } from "./Spotlight";
import { TouchGate } from "./TouchGate";

export function TutorialOverlay() {
  const [skipDialogVisible, setSkipDialogVisible] = useState(false);
  const {
    state,
    currentStep,
    currentAnchorRect,
    advanceCta,
    advanceScreenTap,
    skip,
    reportAnchorTap,
    triggerAnchorAction,
  } = useTutorial();
  const insets = useSafeAreaInsets();
  const { width: screenW, height: screenH } = useWindowDimensions();

  const visible = state.phase !== "idle" && state.phase !== "done";
  if (!visible || !currentStep) return null;

  const showCta = currentStep.trigger.type === "cta";
  const advanceOnScreenTap = currentStep.trigger.type === "auto-or-tap";
  const ctaLabel =
    currentStep.trigger.type === "cta" ? currentStep.trigger.label : "";

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
  const isLastStep = stepIndex === TOTAL_STEPS - 1;
  const spotlightRect = applySpotlightInsets(
    currentAnchorRect,
    currentStep.spotlightHorizontalInset,
    currentStep.spotlightVerticalInset,
  );
  const anchorCenter = currentAnchorRect
    ? {
        x: currentAnchorRect.x + currentAnchorRect.width / 2,
        y: currentAnchorRect.y + currentAnchorRect.height / 2,
      }
    : null;

  const charCenterX = charPos.left + CHARACTER_BODY_W / 2;
  const charCenterY = charPos.top + CHARACTER_BODY_H / 2;
  const bubbleAboveChar = charPos.top + CHARACTER_BODY_H > screenH * 0.5;

  const proxyAnchorId =
    state.phase === "waiting" &&
    currentAnchorRect &&
    currentStep.anchorId &&
    (currentStep.trigger.type === "tap-anchor" ||
      currentStep.trigger.type === "navigation" ||
      currentStep.trigger.type === "progress")
      ? currentStep.anchorId
      : null;

  return (
    <>
      {/* Visual layer. Touch blocking is handled by the interaction layer so
          the dimmed area never leaks taps to the screen underneath. */}
      <Animated.View
        pointerEvents="none"
        entering={FadeIn.duration(280)}
        style={StyleSheet.absoluteFill}
      >
        <Spotlight
          rect={spotlightRect ?? null}
          isSuccess={state.phase === "success"}
          shape={currentStep.spotlightShape}
          padding={currentStep.spotlightPadding}
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
            />
          </View>
        ) : null}

      </Animated.View>

      {/* Interaction layer — blocks dimmed areas, keeps active target + skip tappable. */}
      <View
        pointerEvents="box-none"
        style={StyleSheet.absoluteFill}
      >
        <TouchGate rect={spotlightRect ?? null} />

        {advanceOnScreenTap && state.phase === "waiting" ? (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              advanceScreenTap();
            }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        {proxyAnchorId && currentAnchorRect ? (
          <Pressable
            onPress={() => {
              if (currentStep.trigger.type === "tap-anchor") {
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
            <Pressable
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                advanceCta();
              }}
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
            >
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setSkipDialogVisible(true);
          }}
          hitSlop={12}
          style={[styles.skipBtn, { top: insets.top + 8 }]}
        >
          <Text style={styles.skipText}>건너뛰기</Text>
        </Pressable>

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
  bubbleWrap: {
    position: "absolute",
    left: 24,
    right: 24,
    alignItems: "center",
  },
});
