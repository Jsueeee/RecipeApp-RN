import { View, Text } from "react-native";
import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import { RecentKeywords } from "./RecentKeywords";
import { PopularKeywords } from "./PopularKeywords";

interface Props {
  recentKeywords: string[];
  popularKeywords: string[];
  onKeywordPress: (keyword: string) => void;
  onResetPress: () => void;
  onRemovePress: (keyword: string) => void;
}

export function SearchKeywords({
  recentKeywords,
  popularKeywords,
  onKeywordPress,
  onResetPress,
  onRemovePress,
}: Props) {
  return (
    <View className="flex-1">
      {recentKeywords.length > 0 && (
        <View className="mt-5">
          <RecentKeywords
            keywords={recentKeywords}
            onKeywordPress={onKeywordPress}
            onResetPress={onResetPress}
            onRemovePress={onRemovePress}
          />
        </View>
      )}

      {popularKeywords.length > 0 && (
        <View className="mt-10">
          <PopularKeywords
            keywords={popularKeywords}
            onKeywordPress={onKeywordPress}
          />
        </View>
      )}
    </View>
  );
}
