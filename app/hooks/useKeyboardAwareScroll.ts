import { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  StatusBar,
  TextInput as RNTextInput,
} from "react-native";
import type { SharedValue } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

/**
 * 키보드가 올라왔을 때 포커스된 입력창이 가려지지 않도록 스크롤하는 훅.
 *
 * Dimensions.get("window").height - keyboardHeight 대신 키보드 이벤트의 endCoordinates.screenY를
 * 직접 사용.
 *
 * Android 문제 원인:
 * - measureInWindow는 윈도우 기준 좌표 반환 (상태바 아래부터 시작)
 * - 키보드 screenY는 스크린 기준 좌표 (상태바 포함)
 * - 이 차이가 상태바 높이(~24dp)만큼의 오차를 만들어서 입력창이 살짝 가려짐
 *
 * 해결:
 * - keyboardScreenYRef에 endCoordinates.screenY(키보드 상단 스크린 좌표)를 직접 저장
 * - Android에서는 StatusBar.currentHeight를 더해서 입력창 위치를 스크린 좌표로 변환
 * - iOS에서는 measureInWindow와 screenY가 같은 좌표계이므로 오프셋 불필요
 */
export function useKeyboardAwareScroll(
  scrollViewRef: React.RefObject<Reanimated.ScrollView | null>,
  scrollY: SharedValue<number>,
) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardScreenYRef = useRef(0);
  const contentSizeScrollTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const scrollToFocusedInput = useCallback(() => {
    const focusedInput = RNTextInput.State.currentlyFocusedInput?.();
    if (
      !focusedInput ||
      !scrollViewRef.current ||
      keyboardScreenYRef.current === 0
    )
      return;

    focusedInput.measureInWindow?.(
      (_x: number, y: number, _width: number, height: number) => {
        if (!height) return;

        const statusBarOffset =
          Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
        const inputScreenBottom = y + height + statusBarOffset;
        const keyboardTop = keyboardScreenYRef.current;
        const padding = 60;

        if (inputScreenBottom + padding > keyboardTop) {
          const scrollAmount = inputScreenBottom + padding - keyboardTop;
          scrollViewRef.current?.scrollTo({
            y: scrollY.value + scrollAmount,
            animated: true,
          });
        }
      },
    );
  }, [scrollViewRef, scrollY]);

  const handleInputFocus = useCallback(() => {
    if (keyboardScreenYRef.current > 0) {
      setTimeout(scrollToFocusedInput, 100);
    }
  }, [scrollToFocusedInput]);

  const handleInputContentSizeChange = useCallback(() => {
    if (keyboardScreenYRef.current === 0) return;

    if (contentSizeScrollTimeoutRef.current) {
      clearTimeout(contentSizeScrollTimeoutRef.current);
    }
    contentSizeScrollTimeoutRef.current = setTimeout(() => {
      contentSizeScrollTimeoutRef.current = null;
      scrollToFocusedInput();
    }, 50);
  }, [scrollToFocusedInput]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(showEvent, (e) => {
      keyboardScreenYRef.current = e.endCoordinates.screenY;
      setKeyboardHeight(e.endCoordinates.height);

      const delay = Platform.OS === "ios" ? 50 : 100;
      setTimeout(scrollToFocusedInput, delay);
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      keyboardScreenYRef.current = 0;
      setKeyboardHeight(0);

      if (contentSizeScrollTimeoutRef.current) {
        clearTimeout(contentSizeScrollTimeoutRef.current);
        contentSizeScrollTimeoutRef.current = null;
      }
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
      if (contentSizeScrollTimeoutRef.current) {
        clearTimeout(contentSizeScrollTimeoutRef.current);
      }
    };
  }, [scrollToFocusedInput]);

  return {
    keyboardHeight,
    handleInputFocus,
    handleInputContentSizeChange,
  };
}
