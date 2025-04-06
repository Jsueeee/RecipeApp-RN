import HeartFillIcon from "@/assets/images/ic_heart_fill.svg";
import HeartStrokeIcon from "@/assets/images/ic_heart_stroke.svg";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

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

  return (
    <TouchableOpacity
      hitSlop={10}
      onPress={onScrapClick}
      className="flex-row items-center gap-[2px]"
    >
      {isScrapped ? (
        <HeartFillIcon color="#F3734F" width={16} height={16} />
      ) : (
        <HeartStrokeIcon color="#3F4542" width={16} height={16} />
      )}

      <Text className="text-body4 text-text-normal">{scrapCount}</Text>
    </TouchableOpacity>
  );
};

export default RecipeViewScrapCount;
