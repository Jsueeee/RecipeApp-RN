import { PressableScale } from "@/app/components/PressableScale";
import { UserRecipeSummary } from "@/app/types/domain/mypage";
import i18n from "@/lib/i18n";
import React from "react";
import { Image, Text, View } from "react-native";

interface Props {
  recipes: UserRecipeSummary[];
  className?: string;
}

const ThumbnailItem = ({
  recipe,
  onPress,
}: {
  recipe: UserRecipeSummary | null;
  onPress?: (id: number) => void;
}) => {
  console.log("recipe", recipe);

  if (!recipe) {
    return <View className="flex-1 aspect-square" />;
  }

  return (
    <PressableScale
      onPress={() => onPress?.(recipe.id)}
      className="flex-1 aspect-square"
    >
      <View className="rounded-[12px] overflow-hidden">
        <Image
          source={{ uri: recipe.thumbnail ?? "" }}
          className="w-full h-full bg-gray-50"
          resizeMode="cover"
        />
      </View>
    </PressableScale>
  );
};

export function MyRecipeSummary({ recipes = [], className }: Props) {
  const onAllViewPress = () => {
    console.log("all view press");
  };

  const onRecipeItemPress = (id: number) => {
    console.log("recipe item press", id);
  };

  return (
    <View className={`flex-column px-4 ${className}`}>
      <View className="flex-row items-center justify-between">
        <Text className="text-title4 text-text-strong">
          {i18n.t("myPage.my_recipe_title")}
        </Text>

        <PressableScale onPress={onAllViewPress}>
          <Text className="text-body3 text-text-alternative">
            {i18n.t("myPage.all_view")}
          </Text>
        </PressableScale>
      </View>

      <View className="mt-[18px]">
        <View className="flex-row gap-2">
          {[0, 1, 2].map((index) => (
            <ThumbnailItem
              key={index}
              recipe={recipes[index]}
              onPress={onRecipeItemPress}
            />
          ))}
        </View>

        {recipes.length > 3 && (
          <View className="flex-row gap-2 mt-2">
            {[3, 4, 5].map((index) => (
              <ThumbnailItem
                key={index}
                recipe={recipes[index]}
                onPress={onRecipeItemPress}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
