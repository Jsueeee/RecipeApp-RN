import { TutorialAnchor, useTutorial } from "@/app/tutorial";
import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import { useCallback, useEffect } from "react";
import { Text, View } from "react-native";

interface Props {
  keywords: string[];
  onKeywordPress: (keyword: string) => void;
}

export function PopularKeywords({ keywords, onKeywordPress }: Props) {
  const { registerAnchorAction, reportProgress } = useTutorial();

  const handleKeywordPress = useCallback(
    (keyword: string, index: number) => {
      onKeywordPress(keyword);
      if (index === 0) {
        reportProgress("search-popular-picked");
      }
    },
    [onKeywordPress, reportProgress],
  );

  useEffect(() => {
    const firstKeyword = keywords[0];
    if (!firstKeyword) return;
    registerAnchorAction("search-popular-keyword", () => {
      handleKeywordPress(firstKeyword, 0);
    });
  }, [handleKeywordPress, keywords, registerAnchorAction]);

  return (
    <View className="px-5">
      <Text className="text-title4 text-text-strong">
        {i18n.t("search.popular_keywords")}
      </Text>

      <View className="mt-3.5 flex-row flex-wrap gap-x-1.5 gap-y-2">
        {keywords.map((keyword, index) => {
          const keywordButton = (
            <PressableScale onPress={() => handleKeywordPress(keyword, index)}>
              <View className="bg-teal-50 rounded-[12px] px-3 py-1.5">
                <Text className="text-body3 text-primary-normal">
                  {keyword}
                </Text>
              </View>
            </PressableScale>
          );

          if (index !== 0) {
            return <View key={keyword + index}>{keywordButton}</View>;
          }

          return (
            <TutorialAnchor key={keyword + index} id="search-popular-keyword">
              {keywordButton}
            </TutorialAnchor>
          );
        })}
      </View>
    </View>
  );
}
