import { PressableScale } from "@/app/components/PressableScale";
import { SearchRecipe } from "@/app/types/domain/recipe";
import React from "react";
import { Image, Text, View } from "react-native";
import RecipeViewScrapCount from "../../(recipe)/components/RecipeViewScrapCount";

interface Props {
  keyword: string;
  recipe: SearchRecipe;
  onScrapButtonPress?: (isScrapped: boolean, recipeId: number) => void;
  onPress?: () => void;
}

/**
 * 검색 결과 레시피 아이템
 */
export default function SearchRecipeItem({
  keyword,
  recipe,
  onScrapButtonPress = () => {},
  onPress = () => {},
}: Props) {
  const highlightKeyword = (text: string) => {
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <Text key={i} className="text-primary-normal">
          {part}
        </Text>
      ) : (
        <Text key={i}>{part}</Text>
      )
    );
  };

  return (
    <PressableScale onPress={onPress}>
      <View className="flex-row px-4 py-5">
        {recipe.thumbnail && (
          <Image
            source={{ uri: recipe.thumbnail }}
            className="w-[84px] h-[84px] rounded-[12px] bg-gray-50"
            resizeMode="cover"
          />
        )}

        <View className="flex-1 ml-4">
          <View className="flex-1">
            <Text
              className="text-base text-gray-900"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {highlightKeyword(recipe.title)}
            </Text>

            <View className="flex-row items-center mt-1">
              {recipe.postUserName && (
                <Text
                  className="text-body4 text-text-assistive flex-1"
                  numberOfLines={1}
                >
                  {recipe.postUserName}
                </Text>
              )}

              {recipe.postUserName && recipe.postDate && (
                <View className="h-4 w-[1px] bg-gray-300 mx-2" />
              )}

              {recipe.postDate && (
                <Text className="text-body4 text-text-assistive flex-1">
                  {recipe.postDate}
                </Text>
              )}
            </View>
          </View>

          <View className="flex-1" />

          <View className="self-end">
            <RecipeViewScrapCount
              viewCount={recipe.viewCount}
              scrapCount={recipe.scrapCount}
              isScrapped={recipe.isScrapped}
              onScrapClick={() =>
                onScrapButtonPress(recipe.isScrapped, recipe.recipeId)
              }
            />
          </View>
        </View>
      </View>
    </PressableScale>
  );
}
