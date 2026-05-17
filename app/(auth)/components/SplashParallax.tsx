import i18n from "@/lib/i18n";
import React, { memo, useState } from "react";
import {
  Animated,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FIGMA = {
  title: { offsetY: -150 },
  appName: { offsetY: 150 },

  // ✅ 토마토 기준
  tomato: { w: 150, h: 140 },

  // 나머지는 토마토 중심 기준 offset
  orange: { offsetX: +90, offsetY: +20, w: 80, h: 67 },
  cheese: { offsetX: -80, offsetY: +47, w: 80, h: 63 },
  sparkleL: { offsetX: -100, offsetY: -50, w: 40, h: 40 },
  sparkleL2: { offsetX: -125, offsetY: -20, w: 28, h: 28 },
  sparkleR: { offsetX: +135, offsetY: 30, w: 40, h: 40 },
  sparkleR2: { offsetX: +75, offsetY: 73, w: 28, h: 28 },
  shadow: { offsetX: 0, offsetY: +110, w: 190, h: 26 },
};

const titleStyle: TextStyle = {
  fontSize: 24,
  fontFamily: "cafe24",
  color: "#0F7660",
  textAlign: "center",
  includeFontPadding: false,
  letterSpacing: 0.5,
};
const appNameStyle: TextStyle = {
  fontSize: 20,
  fontFamily: "cafe24",
  color: "#FFFFFF",
  textAlign: "center",
  includeFontPadding: false,
  letterSpacing: 0.5,
};

type Props = {
  entrance: Animated.Value; // 0→1 : 1초 등장(페이드/살짝 이동)
  lift: Animated.Value; // 0→1 : 그룹을 위로 올림
  liftDistance: number; // 버튼 영역 + 여백
};

const SplashParallax = memo(({ entrance, lift, liftDistance }: Props) => {
  const windowDimensions = useWindowDimensions();
  const [layoutSize, setLayoutSize] = useState({
    width: windowDimensions.width,
    height: windowDimensions.height,
  });

  const W = layoutSize.width;
  const H = layoutSize.height;

  // const scale = W / 360; // Figma 프레임 기준 폭: 360px // TODO : 일단 1로 고정. 디바이스 테스트 해보기
  const scale = 1;

  const tomatoFinalY = (H - liftDistance) / 2;

  // 토마토 중심 좌표
  const tomatoCX = W / 2;
  const tomatoCY = tomatoFinalY + (FIGMA.tomato.h * scale) / 2;

  // 그룹 이동 (위로 올리기)
  const groupTY = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, -liftDistance],
  });

  // 이동 중에만 보이는 패럴랙스
  const phase = lift.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });
  // phase * (v*scale)와 동등하지만 매 호출마다 새 Animated.Value를 생성하지 않는다.
  const mul = (v: number) =>
    phase.interpolate({
      inputRange: [0, 1],
      outputRange: [0, v * scale],
    });

  // 등장/페이드 보조 함수
  const appearShift = (start: number) =>
    entrance.interpolate({
      inputRange: [0, start, 1],
      outputRange: [12 * scale, 12 * scale, 0],
      extrapolate: "clamp",
    });

  const fadeWithLag = (start: number) =>
    entrance.interpolate({
      inputRange: [0, start, 1],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    });

  const insets = useSafeAreaInsets();
  const appNameFontHeight = 20;
  const appNameBottomMargin = 36; // 맨 하단으로부터 36px 위 위치
  const startYAppName =
    H - appNameBottomMargin - appNameFontHeight / 2 - insets.bottom;

  return (
    <Animated.View
      style={[styles.stage, { transform: [{ translateY: groupTY }] }]}
      pointerEvents="none"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setLayoutSize({ width, height });
      }}
    >
      {/* 타이틀 */}
      <Animated.View
        style={[
          styles.absolute,
          {
            top: tomatoCY + FIGMA.title.offsetY * scale,
            left: 0,
            right: 0,
            width: W,
            transform: [
              { translateY: appearShift(0.35) },
              { translateY: mul(18) },
            ],
            opacity: fadeWithLag(0.25),
          },
        ]}
      >
        <Animated.Text style={[titleStyle]}>먹는 거에 진심인</Animated.Text>
        <Animated.Text style={[titleStyle]}>우리들의 공간</Animated.Text>
      </Animated.View>

      {/* 앱 이름 */}
      <Animated.Text
        style={[
          styles.absolute,
          appNameStyle,
          {
            right: 0,
            left: 0,
            width: W,
            transform: [
              {
                translateY: lift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    startYAppName,
                    tomatoCY + FIGMA.appName.offsetY * scale,
                  ],
                }),
              },
            ],
            zIndex: 100,
            opacity: fadeWithLag(0.25),
          },
        ]}
      >
        {i18n.t("app.name")}
      </Animated.Text>

      {/* 토마토 */}
      <Animated.Image
        source={require("@/assets/images/img_splash_tomato.png")}
        resizeMode="contain"
        style={[
          styles.absolute,
          {
            width: FIGMA.tomato.w * scale,
            height: FIGMA.tomato.h * scale,
            left: (W - FIGMA.tomato.w * scale) / 2,
            top: tomatoFinalY,
            transform: [
              { translateY: appearShift(0.22) },
              { translateY: mul(26) },
              { rotate: "-5.77deg" },
            ],
            opacity: fadeWithLag(0.15),
          },
        ]}
      />

      {/* 오렌지 */}
      <Animated.Image
        source={require("@/assets/images/img_splash_orange.png")}
        resizeMode="contain"
        style={[
          styles.absolute,
          {
            width: FIGMA.orange.w * scale,
            height: FIGMA.orange.h * scale,
            left:
              tomatoCX +
              FIGMA.orange.offsetX * scale -
              (FIGMA.orange.w * scale) / 2,
            top:
              tomatoCY +
              FIGMA.orange.offsetY * scale -
              (FIGMA.orange.h * scale) / 2,
            transform: [
              { translateY: appearShift(0.28) },
              { translateY: mul(22) },
              { rotate: "9.3deg" },
            ],
            opacity: fadeWithLag(0.22),
          },
        ]}
      />

      {/* 치즈 */}
      <Animated.Image
        source={require("@/assets/images/img_splash_cheese.png")}
        resizeMode="contain"
        style={[
          styles.absolute,
          {
            width: FIGMA.cheese.w * scale,
            height: FIGMA.cheese.h * scale,
            left:
              tomatoCX +
              FIGMA.cheese.offsetX * scale -
              (FIGMA.cheese.w * scale) / 2,
            top:
              tomatoCY +
              FIGMA.cheese.offsetY * scale -
              (FIGMA.cheese.h * scale) / 2,
            transform: [
              { translateY: appearShift(0.32) },
              { translateY: mul(18) },
              { rotate: "-4.87deg" },
            ],
            opacity: fadeWithLag(0.28),
          },
        ]}
      />

      {/* 반짝이 L */}
      <Animated.Image
        source={require("@/assets/images/img_splash_sparkle_left.png")}
        resizeMode="contain"
        style={[
          styles.absolute,
          {
            width: FIGMA.sparkleL.w * scale,
            height: FIGMA.sparkleL.h * scale,
            left:
              tomatoCX +
              FIGMA.sparkleL.offsetX * scale -
              (FIGMA.sparkleL.w * scale) / 2,
            top:
              tomatoCY +
              FIGMA.sparkleL.offsetY * scale -
              (FIGMA.sparkleL.h * scale) / 2,
            transform: [
              { translateY: appearShift(0.1) },
              { translateY: mul(12) },
            ],
            opacity: fadeWithLag(0.05),
          },
        ]}
      />

      {/* 반짝이 L2 */}
      <Animated.Image
        source={require("@/assets/images/img_splash_sparkle_left_2.png")}
        resizeMode="contain"
        style={[
          styles.absolute,
          {
            width: FIGMA.sparkleL2.w * scale,
            height: FIGMA.sparkleL2.h * scale,
            left:
              tomatoCX +
              FIGMA.sparkleL2.offsetX * scale -
              (FIGMA.sparkleL2.w * scale) / 2,
            top:
              tomatoCY +
              FIGMA.sparkleL2.offsetY * scale -
              (FIGMA.sparkleL2.h * scale) / 2,
            transform: [
              { translateY: appearShift(0.1) },
              { translateY: mul(12) },
            ],
            opacity: fadeWithLag(0.05),
          },
        ]}
      />

      {/* 반짝이 R */}
      <Animated.Image
        source={require("@/assets/images/img_splash_sparkle_right.png")}
        resizeMode="contain"
        style={[
          styles.absolute,
          {
            width: FIGMA.sparkleR.w * scale,
            height: FIGMA.sparkleR.h * scale,
            left:
              tomatoCX +
              FIGMA.sparkleR.offsetX * scale -
              (FIGMA.sparkleR.w * scale) / 2,
            top:
              tomatoCY +
              FIGMA.sparkleR.offsetY * scale -
              (FIGMA.sparkleR.h * scale) / 2,
            transform: [
              { translateY: appearShift(0.12) },
              { translateY: mul(12) },
            ],
            opacity: fadeWithLag(0.08),
          },
        ]}
      />

      {/* 반짝이 R2 */}
      <Animated.Image
        source={require("@/assets/images/img_splash_sparkle_right_2.png")}
        resizeMode="contain"
        style={[
          styles.absolute,
          {
            width: FIGMA.sparkleR2.w * scale,
            height: FIGMA.sparkleR2.h * scale,
            left:
              tomatoCX +
              FIGMA.sparkleR2.offsetX * scale -
              (FIGMA.sparkleR2.w * scale) / 2,
            top:
              tomatoCY +
              FIGMA.sparkleR2.offsetY * scale -
              (FIGMA.sparkleR2.h * scale) / 2,
            transform: [
              { translateY: appearShift(0.12) },
              { translateY: mul(12) },
            ],
            opacity: fadeWithLag(0.08),
          },
        ]}
      />

      {/* 그림자 */}
      <Animated.Image
        source={require("@/assets/images/img_splash_shadow.png")}
        resizeMode="contain"
        style={[
          styles.absolute,
          {
            width: FIGMA.shadow.w * scale,
            height: FIGMA.shadow.h * scale,
            left:
              tomatoCX +
              FIGMA.shadow.offsetX * scale -
              (FIGMA.shadow.w * scale) / 2,
            top:
              tomatoCY +
              FIGMA.shadow.offsetY * scale -
              (FIGMA.shadow.h * scale) / 2,
            transform: [
              { translateY: appearShift(0.38) },
              { translateY: mul(8) },
            ],
            opacity: fadeWithLag(0.35),
          },
        ]}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    height: "100%",
  },
  absolute: {
    position: "absolute",
  },
});

export default SplashParallax;
