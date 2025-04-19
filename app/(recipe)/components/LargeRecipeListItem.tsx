import { PressableScale } from "@/app/components/PressableScale";
import React from "react";
import { Image, Text, View } from "react-native";
import RecipeMatching from "../../(tabs)/(recipe)/components/RecipeMatching";
import RecipeViewScrapCount from "../../(tabs)/(recipe)/components/RecipeViewScrapCount";

interface Props {
  recipeId: number;
  title: string;
  thumbnail: string | null;
  description: string | null;
  ingredientMatchRate: number | null;
  viewCount: number;
  scrapCount: number;
  isScrapped: boolean;
  isMatchRateShow?: boolean;
  isScrapCountShow?: boolean;
  onScrapPress?: (recipeId: number, isScrapped: boolean) => void;
  onPress?: () => void;
  className?: string;
}

const LargeRecipeListItem: React.FC<Props> = ({
  recipeId,
  title,
  thumbnail,
  description,
  ingredientMatchRate,
  viewCount,
  scrapCount,
  isScrapped,
  isMatchRateShow = true,
  isScrapCountShow = true,
  onScrapPress = () => {},
  onPress = () => {},
  className = "",
}) => {
  return (
    <PressableScale onPress={onPress} className={className}>
      <View className="flex-row px-4 py-5">
        <Image
          source={{ uri: thumbnail ?? "" }}
          className="w-[124px] h-[124px] rounded-[12px] mr-4 bg-gray-50"
        />

        <View className="flex-1 h-[124px]">
          <Text
            className="text-title5 text-text-strong"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>

          {description && (
            <Text
              className="text-body3 text-text-alternative mt-1"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {description}
            </Text>
          )}

          {isMatchRateShow && ingredientMatchRate !== null && (
            <View className="my-2">
              <RecipeMatching matchingRate={ingredientMatchRate} />
            </View>
          )}

          <View className="flex-1" />

          {isScrapCountShow && (
            <View className="self-end">
              <RecipeViewScrapCount
                viewCount={viewCount}
                scrapCount={scrapCount}
                isScrapped={isScrapped}
                onScrapClick={() => onScrapPress(recipeId, isScrapped)}
              />
            </View>
          )}
        </View>
      </View>
    </PressableScale>
  );
};

export default LargeRecipeListItem;
