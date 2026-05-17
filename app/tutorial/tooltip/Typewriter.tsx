import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, type TextProps } from "react-native";
import { selection as hapticSelection } from "@/app/lib/haptics";

type Props = TextProps & {
  text: string;
  active?: boolean;
  charDelayMs?: number;
  startDelayMs?: number;
  cursor?: boolean;
  /** 글자가 한 자씩 드러날 때마다 가벼운 햅틱을 발사. 공백 문자는 자동 스킵. */
  haptic?: boolean;
  /** 마지막 글자가 드러난 직후 1회 호출. 빈 문자열이면 즉시 호출. */
  onComplete?: () => void;
};

export function Typewriter({
  text,
  active = true,
  charDelayMs = 28,
  startDelayMs = 0,
  cursor = false,
  haptic = false,
  onComplete,
  style,
  ...rest
}: Props) {
  // onComplete 가 매 렌더마다 새 함수여도 effect 가 재실행되지 않도록 ref 로 보관.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  // 문자열을 코드포인트 단위로 분해해 두면 🍅 같은 surrogate pair 가
  // 한 글자로 취급돼 한 번에 드러난다. (string.slice 는 UTF-16 코드 유닛
  // 기준이라 절반만 잘리면 ? 비슷한 replacement 글리프가 보임)
  const chars = useMemo(() => Array.from(text), [text]);
  const totalChars = chars.length;
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

    // 빈 문자열인 경우 타이핑 없이 즉시 완료 신호.
    if (totalChars === 0) {
      onCompleteRef.current?.();
      return;
    }

    let i = 0;
    const tick = () => {
      if (cancelRef.current) return;
      i += 1;
      setRevealed(i);
      if (haptic) {
        const ch = chars[i - 1];
        // 공백/줄바꿈에서는 햅틱을 건너뛴다 — 타자 치는 느낌을 더 자연스럽게.
        if (ch && /\S/.test(ch)) {
          hapticSelection();
        }
      }
      if (i < totalChars) {
        timeoutRef.current = setTimeout(tick, charDelayMs);
      } else {
        onCompleteRef.current?.();
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
  }, [active, chars, totalChars, charDelayMs, startDelayMs, haptic]);

  useEffect(() => {
    if (!cursor || !active) return;
    const t = setInterval(() => {
      if (revealedRef.current >= totalChars) {
        clearInterval(t);
        return;
      }
      setCursorOn((p) => !p);
    }, 480);
    return () => clearInterval(t);
  }, [active, cursor, totalChars]);

  const showCursor = cursor && revealed < totalChars;

  return (
    <Text style={style} {...rest}>
      {chars.slice(0, revealed).join("")}
      {showCursor ? (cursorOn ? "▍" : " ") : ""}
    </Text>
  );
}
