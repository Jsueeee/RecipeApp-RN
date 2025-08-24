import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

type Props = React.PropsWithChildren<{ pointerEvents?: "auto" | "box-none" }>;

/**
 * Android에서 Modal이 부모 트리의 transform(scale 등)을 그대로 물려받아
 * 모달이 작게/위치 이상하게 보이는 문제가 있음.
 * 부모 뷰 (recipe)/(deatail) 에서 imageAnimatedStyle 가 원인
 *
 * 해결 방법:
 * - Modal 최상단 컨테이너를 Animated.View로 두고
 *   transform: [{scaleX:1}, {scaleY:1}] 를 강제로 적용
 * - renderToHardwareTextureAndroid / needsOffscreenAlphaCompositing 으로
 *   별도 합성 레이어를 만들면 부모 transform 전파가 끊김
 *
 * 즉, Animated.View는 "스케일 리셋" 역할을 해서
 * 조상 뷰의 애니메이션(scale, translate 등)이 모달에 영향을 주지 않게 함.
 */
export const UnscaledModalRoot = ({
  children,
  pointerEvents = "box-none",
}: Props) => {
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { transform: [{ scaleX: 1 }, { scaleY: 1 }] },
      ]}
      renderToHardwareTextureAndroid
      needsOffscreenAlphaCompositing
      collapsable={false}
      pointerEvents={pointerEvents}
    >
      {children}
    </Animated.View>
  );
};
