import { PressableScale } from "@/app/components/PressableScale";
import React from "react";
import { Image, Text, View } from "react-native";
import RecipeViewScrapCount from "../../(tabs)/(recipe)/components/RecipeViewScrapCount";

interface Props {
  keyword?: string;
  recipeId: number;
  title: string;
  thumbnail: string | null;
  postUserName: string | null;
  postDate: string | null;
  viewCount: number;
  scrapCount: number;
  isScrapped: boolean;
  onScrapButtonPress?: (isScrapped: boolean, recipeId: number) => void;
  onPress?: () => void;
}

/**
 * 검색 결과 레시피 아이템
 */
const SmallRecipeListItem = ({
  keyword,
  recipeId,
  title,
  thumbnail,
  postUserName,
  postDate,
  viewCount,
  scrapCount,
  isScrapped,
  onScrapButtonPress = () => {},
  onPress = () => {},
}: Props) => {
  const highlightKeyword = (text: string) => {
    if (!keyword) return text;

    const parts = text.split(new RegExp(`(${keyword})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <Text key={i} className="text-body2 text-primary-normal">
          {part}
        </Text>
      ) : (
        <Text key={i}>{part}</Text>
      ),
    );
  };

  return (
    <PressableScale onPress={onPress}>
      <View className="flex-row px-4 py-5">
        <Image
          source={{ uri: thumbnail ?? "" }}
          className="w-[120px] h-[120px] rounded-[12px] bg-gray-50"
          resizeMode="cover"
        />

        <View className="flex-1 ml-4">
          <View className="flex-1">
            <Text
              className="text-body2 text-text-normal"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {highlightKeyword(title)}
            </Text>

            <View className="flex-row mt-1 flex-1">
              {postUserName && (
                <Text
                  className="text-body4 text-text-assistive flex-shrink"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {postUserName}
                </Text>
              )}

              {postUserName && postDate && (
                <View className="h-4 w-[1px] bg-gray-300 mx-2" />
              )}

              {postDate && (
                <Text
                  className="text-body4 text-text-assistive"
                  numberOfLines={1}
                >
                  {postDate}
                </Text>
              )}
            </View>
          </View>

          <View className="flex-1" />

          <View className="self-end">
            <RecipeViewScrapCount
              viewCount={viewCount}
              scrapCount={scrapCount}
              isScrapped={isScrapped}
              onScrapClick={() => onScrapButtonPress(isScrapped, recipeId)}
            />
          </View>
        </View>
      </View>
    </PressableScale>
  );
};

export default React.memo(SmallRecipeListItem);
