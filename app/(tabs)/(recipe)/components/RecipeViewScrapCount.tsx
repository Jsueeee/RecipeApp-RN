import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import IC_Heart_Fill from "@/assets/images/ic_like_heart_fill.svg";
import IC_Heart_Empty from "@/assets/images/ic_like_heart_stroke.svg";

interface Props {
  viewCount?: number;
  scrapCount: number;
  isScrapped: boolean;
  onScrapClick?: () => void;
}

const RecipeViewScrapCount: React.FC<Props> = ({
  viewCount,
  scrapCount,
  isScrapped,
  onScrapClick = () => {},
}) => {
  const animationRef = useRef<LottieView>(null);

  // 화면에 실제로 보이는 아이콘 상태(애니메이션 완료 시 반영)
  const [visualScrapped, setVisualScrapped] = useState(isScrapped);
  const [playing, setPlaying] = useState(false);

  // prop이 바뀌면(서버/부모 갱신) 애니메이션 트리거
  useEffect(() => {
    if (isScrapped === visualScrapped) return;

    if (isScrapped) {
      setPlaying(true);
      requestAnimationFrame(() => {
        animationRef.current?.play(500, 520);
      });
    } else {
      setVisualScrapped(false);
      setPlaying(false);
      animationRef.current?.reset?.();
    }
  }, [isScrapped, visualScrapped]);

  return (
    <>
      {/* 애니메이션 중에는 아이콘을 렌더링하지 않음 */}
      {!playing &&
        (visualScrapped ? (
          <IC_Heart_Fill
            width={15}
            height={15}
            style={{ position: "absolute", right: 8, bottom: 2 }}
          />
        ) : (
          <IC_Heart_Empty
            width={15}
            height={15}
            style={{ position: "absolute", right: 8, bottom: 2 }}
          />
        ))}

      {/* 애니메이션은 playing일 때만 표시 */}
      <LottieView
        ref={animationRef}
        style={{
          position: "absolute",
          width: 70,
          height: 70,
          bottom: -25,
          right: -20,
          opacity: playing ? 1 : 0,
        }}
        loop={false}
        source={require("@/assets/lottie/lottie_like_heart.json")}
        onAnimationFinish={() => {
          // 애니 끝나면 시각 상태를 실제 값으로 커밋하고 아이콘으로 복귀
          setVisualScrapped(isScrapped);
          setPlaying(false);
        }}
      />

      <TouchableOpacity
        hitSlop={20}
        disabled={playing} // 애니 도는 동안 중복 탭 방지
        onPress={onScrapClick}
        className="flex-row items-center gap-[2px] w-[30px] h-[30px] absolute bottom-0 right-0"
      />
    </>
  );
};

export default RecipeViewScrapCount;
