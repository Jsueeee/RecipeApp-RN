import i18n from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  matchingRate: number;
}

const RecipeMatching: React.FC<Props> = ({ matchingRate }) => {
  return (
    <View className="rounded-[8px] bg-gray-50 px-1.5 py-1 flex-row items-center self-start">
      <Text className="text-utility4 text-text-normal">
        {i18n.t("recipe.matchingRate")}
      </Text>
      <Text className="text-utility4 text-primary-heavy">
        {` ${matchingRate}${i18n.t("recipe.matchingRateDesc")}`}
      </Text>
    </View>
  );
};

export default RecipeMatching;
