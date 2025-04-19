import { PressableScale } from "@/app/components/PressableScale";
import { RecipeSummary } from "@/app/types/domain/recipe";
import React from "react";
import { Image, Text, View } from "react-native";
import RecipeMatching from "./RecipeMatching";
import RecipeViewScrapCount from "./RecipeViewScrapCount";

interface Props {
  item: RecipeSummary;
  isMatchRateShow?: boolean;
  isScrapCountShow?: boolean;
  onScrapPress?: (recipeId: number, isScrapped: boolean) => void;
  onPress?: () => void;
  className?: string;
}

const RecipeItem: React.FC<Props> = ({
  item,
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
          source={{ uri: item.thumbnail ?? "" }}
          className="w-[124px] h-[124px] rounded-[12px] mr-4 bg-gray-50"
        />

        <View className="flex-1 h-[124px]">
          <Text
            className="text-title5 text-text-strong"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>

          {item.description && (
            <Text
              className="text-body3 text-text-alternative mt-1"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          )}

          {isMatchRateShow && item.ingredientMatchRate !== null && (
            <View className="my-2">
              <RecipeMatching matchingRate={item.ingredientMatchRate} />
            </View>
          )}

          <View className="flex-1" />

          {isScrapCountShow && (
            <View className="self-end">
              <RecipeViewScrapCount
                viewCount={item.viewCount}
                scrapCount={item.scrapCount}
                isScrapped={item.isScrapped}
                onScrapClick={() => onScrapPress(item.id, item.isScrapped)}
              />
            </View>
          )}
        </View>
      </View>
    </PressableScale>
  );
};

export default RecipeItem;
