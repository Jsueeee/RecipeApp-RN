import { RecipeSourceTypeTabRow } from "@/components/RecipeSourceTypeTabRow";
import {
  RECIPE_SOURCE_TYPE,
  RecipeSourceType,
} from "@/constants/RecipeSourceType";
import React, { useState } from "react";
import { View } from "react-native";

interface Props {
  keyword: string;
}

export default function SearchResult({ keyword }: Props) {
  const [selectedTab, setSelectedTab] = useState<RecipeSourceType>(
    RECIPE_SOURCE_TYPE[0]
  );

  return (
    <View className="flex-1">
      <RecipeSourceTypeTabRow
        tabs={RECIPE_SOURCE_TYPE}
        selectedTab={selectedTab}
        onTabSelected={setSelectedTab}
      />
    </View>
  );
}
