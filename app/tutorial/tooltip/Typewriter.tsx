import React, { useEffect, useRef, useState } from "react";
import { Text, type TextProps } from "react-native";

type Props = TextProps & {
  text: string;
  active?: boolean;
  charDelayMs?: number;
  startDelayMs?: number;
  cursor?: boolean;
};

export function Typewriter({
  text,
  active = true,
  charDelayMs = 28,
  startDelayMs = 0,
  cursor = false,
  style,
  ...rest
}: Props) {
  const [revealed, setRevealed] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const cancelRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealedRef = useRef(0);

  useEffect(() => {
    revealedRef.current = revealed;
  }, [revealed]);

  useEffect(() => {
    cancelRef.current = false;
    setRevealed(0);
    if (!active) {
      return () => {
        cancelRef.current = true;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }

    let i = 0;
    const tick = () => {
      if (cancelRef.current) return;
      i += 1;
      setRevealed(i);
      if (i < text.length) {
        timeoutRef.current = setTimeout(tick, charDelayMs);
      }
    };
    timeoutRef.current = setTimeout(tick, startDelayMs);
    return () => {
      cancelRef.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [active, text, charDelayMs, startDelayMs]);

  useEffect(() => {
    if (!cursor || !active) return;
    const t = setInterval(() => {
      if (revealedRef.current >= text.length) {
        clearInterval(t);
        return;
      }
      setCursorOn((p) => !p);
    }, 480);
    return () => clearInterval(t);
  }, [active, cursor, text.length]);

  const showCursor = cursor && revealed < text.length;

  return (
    <Text style={style} {...rest}>
      {text.slice(0, revealed)}
      {showCursor ? (cursorOn ? "▍" : " ") : ""}
    </Text>
  );
}
