import {
  CategorizedPickIngredients,
  PickIngredient,
} from "@/app/types/domain/ingredient";
import React, { useMemo } from "react";
import {
  SectionList,
  SectionListRenderItemInfo,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { PickIngredientItem } from "./PickIngredientItem";
import { RemoveIngredientItem } from "./RemoveIngredientItem";

interface Props {
  categorizedIngredients: CategorizedPickIngredients[];
  isRemoveMode?: boolean; // 오른쪽 상단에 삭제 버튼 보여줄건지
  isNameVisible?: boolean; // 이름 보여줄건지 (ex: 아이콘만 선택할 때)
  selectedIngredients?: PickIngredient[];
  onPress?: (ingredientId: number) => void;
  onRemoveButtonPress?: (ingredient: PickIngredient) => void;
  className?: string;
}

interface IngredientSection {
  id: number;
  title: string;
  data: PickIngredient[][];
}

export const IngredientIconGrid = ({
  categorizedIngredients,
  isRemoveMode = false,
  isNameVisible = true,
  selectedIngredients,
  onPress,
  onRemoveButtonPress,
  className,
}: Props) => {
  const { width } = useWindowDimensions();
  const ROW_COUNT = width >= 500 ? 6 : 4;

  const EmptySpace = useMemo(() => <View className="w-[76px]" />, []);

  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const sections: IngredientSection[] = categorizedIngredients
    .filter((section) => section.ingredients.length > 0)
    .map((section) => ({
      title: section.ingredientCategoryName,
      data: chunkArray(section.ingredients, ROW_COUNT),
      id: section.ingredientCategoryId,
    }));

  const renderSectionHeader = ({ section }: { section: IngredientSection }) => (
    <View className="pt-4">
      <Text className="text-title4 text-text-strong">{section.title}</Text>
    </View>
  );

  const renderItem = ({
    item: rowItems,
  }: SectionListRenderItemInfo<PickIngredient[], IngredientSection>) => (
    <View className={`flex-row justify-between mb-4 ${className}`}>
      {rowItems.map((item, index) =>
        isRemoveMode ? (
          <RemoveIngredientItem
            key={item.ingredientId}
            ingredientId={item.ingredientId}
            ingredientName={item.ingredientName}
            ingredientIconId={item.ingredientIconId}
            onRemovePress={() => onRemoveButtonPress?.(item)}
          />
        ) : (
          <PickIngredientItem
            key={item.ingredientId}
            ingredientId={item.ingredientId}
            ingredientName={item.ingredientName}
            ingredientIconId={item.ingredientIconId}
            isSelected={
              selectedIngredients?.some(
                (ingredient) => ingredient.ingredientId === item.ingredientId
              ) ?? false
            }
            isNameVisible={isNameVisible}
            onPress={() => onPress?.(item.ingredientIconId ?? -1)}
          />
        )
      )}

      {Array(ROW_COUNT - rowItems.length)
        .fill(0)
        .map((_, i) => (
          <React.Fragment key={`empty-${i}`}>{EmptySpace}</React.Fragment>
        ))}
    </View>
  );

  return (
    <SectionList<PickIngredient[], IngredientSection>
      sections={sections}
      keyExtractor={(row, index) =>
        row.map((i) => i.ingredientId).join("-") + index
      }
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      contentContainerStyle={{
        gap: 16,
        paddingBottom: 36,
        paddingHorizontal: 16,
      }}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    />
  );
};
