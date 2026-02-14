import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";

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
  const prevScrappedRef = useRef(isScrapped);
  const isPlayingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [displayScrapped, setDisplayScrapped] = useState(isScrapped);

  useEffect(() => {
    const wasScrapped = prevScrappedRef.current;

    // 자연스러운 애니메이션을 위해 displayScrapped는 아직 false로 유지 → 애니메이션 끝난 후 true로 변경
    if (!wasScrapped && isScrapped) {
      isPlayingRef.current = true;
      setPlaying(true);
    }

    if (wasScrapped && !isScrapped) {
      isPlayingRef.current = false;
      setPlaying(false);
      setDisplayScrapped(false);
      animationRef.current?.reset();
    }

    prevScrappedRef.current = isScrapped;
  }, [isScrapped]);

  // playing이 true가 되면 (리렌더링 후) 애니메이션 재생
  useEffect(() => {
    if (playing) {
      animationRef.current?.play(40, 120);
    }
  }, [playing]);

  return (
    <Pressable
      hitSlop={20}
      onPress={(e) => {
        e.stopPropagation();
        onScrapClick();
      }}
      className="w-[40px] h-[40px] absolute bottom-[-8px] right-[-2px] z-10 border items-center justify-center"
    >
      <LottieView
        ref={animationRef}
        style={{
          width: 50,
          height: 50,
        }}
        source={require("@/assets/lottie/heart_bump.json")}
        loop={false}
        progress={playing ? undefined : displayScrapped ? 1 : 0}
        onAnimationFinish={() => {
          if (!isPlayingRef.current) return;
          isPlayingRef.current = false;

          setPlaying(false);
          setDisplayScrapped(true);
        }}
      />
    </Pressable>
  );
};

export default RecipeViewScrapCount;
