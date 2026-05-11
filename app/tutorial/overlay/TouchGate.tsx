import React from "react";
import { Pressable, StyleSheet } from "react-native";
import type { Rect } from "../engine/types";

type Props = {
  rect: Rect | null;
  padding?: number;
};

/**
 * Renders 4 transparent absolute views surrounding the spotlight rect to block
 * taps everywhere except the rect itself. When `rect` is null, blocks the
 * entire screen.
 */
export function TouchGate({ rect, padding = 8 }: Props) {
  if (!rect) {
    return <Pressable onPress={() => {}} style={StyleSheet.absoluteFill} />;
  }

  const x = rect.x - padding;
  const y = rect.y - padding;
  const w = rect.width + padding * 2;
  const h = rect.height + padding * 2;

  return (
    <>
      <Pressable
        onPress={() => {}}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: Math.max(0, y),
        }}
      />
      <Pressable
        onPress={() => {}}
        style={{
          position: "absolute",
          left: 0,
          top: y,
          width: Math.max(0, x),
          height: h,
        }}
      />
      <Pressable
        onPress={() => {}}
        style={{
          position: "absolute",
          left: x + w,
          top: y,
          right: 0,
          height: h,
        }}
      />
      <Pressable
        onPress={() => {}}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y + h,
          bottom: 0,
        }}
      />
    </>
  );
}
