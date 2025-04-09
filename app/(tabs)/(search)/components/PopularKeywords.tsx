import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import { Text, View } from "react-native";

interface Props {
  keywords: string[];
  onKeywordPress: (keyword: string) => void;
}

export function PopularKeywords({ keywords, onKeywordPress }: Props) {
  return (
    <View className="px-5">
      <Text className="text-title4 text-text-strong">
        {i18n.t("search.popular_keywords")}
      </Text>

      <View className="mt-3.5 flex-row flex-wrap gap-x-1.5 gap-y-2">
        {keywords.map((keyword, index) => (
          <PressableScale
            key={keyword + index}
            onPress={() => onKeywordPress(keyword)}
          >
            <View className="bg-teal-50 rounded-[12px] px-3 py-1.5">
              <Text className="text-body3 text-primary-normal">{keyword}</Text>
            </View>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}
