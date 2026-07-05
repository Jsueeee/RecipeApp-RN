import { DebouncedPressable } from "@/app/components/DebouncedPressable";
import { PressableScale } from "@/app/components/PressableScale";
import CloseIcon from "@/assets/images/ic_close.svg";
import i18n from "@/lib/i18n";
import { Text, View } from "react-native";

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

      <View className="mt-3.5 flex-row flex-wrap gap-x-1.5 gap-y-2 px-4">
        {keywords.map((keyword, index) => (
          <PressableScale
            key={keyword + index}
            onPress={() => onKeywordPress(keyword)}
          >
            <View className="flex-row items-center gap-1 bg-fill-subtle rounded-[12px] px-3 py-1.5">
              <Text className="text-body3 text-text-normal">{keyword}</Text>

              <DebouncedPressable
                hitSlop={6}
                onPressBeforeDebounce={(e) => e.stopPropagation()}
                onPress={() => onRemovePress(keyword)}
              >
                <CloseIcon width={16} height={16} color="#9FADA6" />
              </DebouncedPressable>
            </View>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}
