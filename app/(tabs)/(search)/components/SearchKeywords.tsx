import { ScrollView, View } from "react-native";
import { PopularKeywords } from "./PopularKeywords";
import { RecentKeywords } from "./RecentKeywords";
import { SearchKeywordNativeAd } from "./SearchKeywordNativeAd";

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
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
      className="flex-1"
      keyboardShouldPersistTaps="handled"
    >
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
        <>
          <View className="mt-10">
            <PopularKeywords
              keywords={popularKeywords}
              onKeywordPress={onKeywordPress}
            />
          </View>

          <SearchKeywordNativeAd />
        </>
      )}
    </ScrollView>
  );
}
