import { PressableScale } from "@/app/components/PressableScale";
import { PickIngredient } from "@/app/types/domain/ingredient";
import { PickIngredientItem } from "@/components/PickIngredientItem";
import React, { useCallback, useMemo, useRef } from "react";
import { Text, View } from "react-native";

interface Props {
  categoryName: string;
  ingredients: PickIngredient[];
  selectedIngredients: PickIngredient[];
  onSelect: (ingredient: PickIngredient) => void;
  onUnselect: (ingredient: PickIngredient) => void;
}

/**
 * 아이콘이 포함된 재료 선택용 뷰를 카테고리 별로 묶어서 보여주는 컴포넌트
 * Set 사용:
 * Set.has()는 O(1)의 시간 복잡도를 가짐
 * Array.includes()의 O(n)보다 효율적
 *
 * useMemo 사용:
 * selectedSet이 selectedIngredients가 변경될 때만 재생성됨
 * 불필요한 Set 생성 방지
 * isSelected 함수를 제거하고 직접 selectedSet.has()를 사용
 * 매 렌더링마다 함수가 생성되는 것을 방지
 *
 * 결과
 * 검색 성능이 O(n)에서 O(1)로 향상
 * 불필요한 함수 생성과 메모리 할당 감소
 * 전체적인 렌더링 성능 향상
 */
const selectedSetCache = new Map<string, Set<number>>();

export const CategorizedPickIngredientsWithIconGroup = React.memo(
  function CategorizedPickIngredientsWithIconGroup({
    categoryName,
    ingredients,
    selectedIngredients,
    onSelect,
    onUnselect,
  }: Props) {
    const selectedSet = useMemo(() => {
      const cacheKey = selectedIngredients.map((i) => i.ingredientId).join(",");

      if (selectedSetCache.has(cacheKey)) {
        return selectedSetCache.get(cacheKey)!;
      }

      const set = new Set(selectedIngredients.map((i) => i.ingredientId));
      selectedSetCache.set(cacheKey, set);
      return set;
    }, [selectedIngredients]);

    const handlePress = useCallback(
      (ingredient: PickIngredient) => {
        if (selectedSet.has(ingredient.ingredientId)) {
          onUnselect(ingredient);
        } else {
          onSelect(ingredient);
        }
      },
      [selectedSet, onSelect, onUnselect]
    );

    const rows = useMemo(
      () =>
        ingredients.reduce(
          (acc, _, i) =>
            i % 4 === 0 ? [...acc, ingredients.slice(i, i + 4)] : acc,
          [] as PickIngredient[][]
        ),
      [ingredients]
    );

    const EmptySpace = useMemo(() => <View className="w-[76px]" />, []);

    const renderRow = useCallback(
      (row: PickIngredient[]) => (
        <View className="flex-1 flex-row justify-between">
          {row.map((ingredient) => (
            <PickIngredientItem
              key={ingredient.ingredientId}
              ingredientId={ingredient.ingredientId}
              ingredientName={ingredient.ingredientName}
              ingredientIconId={ingredient.ingredientIconId}
              isSelected={selectedSet.has(ingredient.ingredientId)}
              onPress={() => handlePress(ingredient)}
            />
          ))}
          {Array(4 - row.length)
            .fill(0)
            .map((_, i) => (
              <React.Fragment key={`empty-${i}`}>{EmptySpace}</React.Fragment>
            ))}
        </View>
      ),
      [handlePress, selectedSet, EmptySpace]
    );

    return (
      <View className="flex-1 p-4">
        <Text className="text-title4 text-text-strong pb-4">
          {categoryName}
        </Text>

        <View className="gap-4">
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>{renderRow(row)}</React.Fragment>
          ))}
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.categoryName !== nextProps.categoryName) return false;
    if (prevProps.ingredients !== nextProps.ingredients) return false;
    if (prevProps.selectedIngredients !== nextProps.selectedIngredients)
      return false;
    if (prevProps.onSelect !== nextProps.onSelect) return false;
    if (prevProps.onUnselect !== nextProps.onUnselect) return false;
    return true;
  }
);
