import LottieView from "lottie-react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [animating, setAnimating] = useState(false);

  useLayoutEffect(() => {
    if (animating) return;

    if (isScrapped) {
      animationRef.current?.play(120, 120);
    } else {
      animationRef.current?.reset();
    }
  }, [isScrapped, animating]);

  useEffect(() => {
    if (!isScrapped) {
      setAnimating(false);
    }
  }, [isScrapped]);

  // animating이 true가 되면 애니메이션 재생
  useEffect(() => {
    if (animating) {
      animationRef.current?.play(40, 120);
    }
  }, [animating]);

  return (
    <Pressable
      hitSlop={20}
      onPress={(e) => {
        e.stopPropagation();
        if (!isScrapped) {
          setAnimating(true);
        }
        onScrapClick();
      }}
      className="w-[40px] h-[40px] absolute bottom-[-8px] right-[-2px] z-10 items-center justify-center"
    >
      <LottieView
        ref={animationRef}
        style={{
          width: 50,
          height: 50,
        }}
        source={require("@/assets/lottie/heart_bump.json")}
        autoPlay={false}
        loop={false}
        progress={animating ? undefined : isScrapped ? 1 : 0}
        onAnimationFinish={() => {
          setAnimating(false);
        }}
      />
    </Pressable>
  );
};

export default RecipeViewScrapCount;
