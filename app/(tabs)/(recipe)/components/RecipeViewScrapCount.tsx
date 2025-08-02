import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";

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
  // TODO : 조회수 추후 추가 예정

  const animation = useRef<LottieView>(null);
  const initialValue = useRef<boolean | null>(isScrapped);

  useEffect(() => {
    if (isScrapped) {
      animation.current?.play(500, 520);
    } else {
      animation.current?.play(10, 0);
    }
  }, [isScrapped]);

  return (
    <>
      <LottieView
        ref={animation}
        style={{
          position: "absolute",
          width: 70,
          height: 70,
          bottom: -25,
          right: -20,
        }}
        loop={false}
        source={require("@/assets/lottie/lottie_like_heart.json")}
        progress={initialValue.current ? 1 : 0}
        // TODO : 컬러는 고민 좀 해보기
        // colorFilters={[
        //   {
        //     keypath: "heart fill",
        //     color: "#F3734F",
        //   },
        // ]}
      />

      {/* 로티 파일의 영역 때문에 따로 클릭 가능 영역을 지정 */}
      <TouchableOpacity
        hitSlop={10}
        onPress={onScrapClick}
        className="flex-row items-center gap-[2px] w-[30px] h-[30px] absolute bottom-0 right-0"
      />

      {/* TODO : 스크랩 카운트 추후 추가 예정 */}
      {/* <Text className="text-body4 text-text-normal">{scrapCount}</Text> */}
    </>
  );
};

export default RecipeViewScrapCount;
