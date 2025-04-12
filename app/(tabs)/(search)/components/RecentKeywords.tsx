import { PressableScale } from "@/app/components/PressableScale";
import CloseIcon from "@/assets/images/ic_close.svg";
import i18n from "@/lib/i18n";
import { Pressable, ScrollView, Text, View } from "react-native";

interface RecentKeywordsProps {
  keywords: string[];
  onKeywordPress: (keyword: string) => void;
  onResetPress: () => void;
  onRemovePress: (keyword: string) => void;
}

export function RecentKeywords({
  keywords,
  onKeywordPress,
  onResetPress,
  onRemovePress,
}: RecentKeywordsProps) {
  return (
    <View className="w-full">
      <View className="flex-row items-center justify-between px-4">
        <Text className="text-title4 text-text-strong">
          {i18n.t("search.recent_keywords")}
        </Text>

        <PressableScale onPress={onResetPress}>
          <Text className="text-body3 text-text-alternative">
            {i18n.t("search.recent_keywords_clear_all")}
          </Text>
        </PressableScale>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="w-full mt-[14px]"
        contentContainerClassName="px-4 gap-1.5"
      >
        {keywords.map((keyword, index) => (
          <PressableScale
            key={keyword + index}
            onPress={() => onKeywordPress(keyword)}
          >
            <View className="flex-row items-center gap-1 bg-fill-subtle rounded-[12px] px-3 py-1.5">
              <Text className="text-body3 text-text-normal">{keyword}</Text>

              <Pressable hitSlop={6} onPress={() => onRemovePress(keyword)}>
                <CloseIcon width={16} height={16} />
              </Pressable>
            </View>
          </PressableScale>
        ))}
      </ScrollView>
    </View>
  );
}
