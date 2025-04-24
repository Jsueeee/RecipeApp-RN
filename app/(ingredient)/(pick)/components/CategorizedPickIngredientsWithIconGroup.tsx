import { PressableScale } from "@/app/components/PressableScale";
import { PickIngredient } from "@/app/types/domain/ingredient";
import { PickIngredientItem } from "@/components/PickIngredientItem";
import React, { useMemo } from "react";
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
export function CategorizedPickIngredientsWithIconGroup({
  categoryName,
  ingredients,
  selectedIngredients,
  onSelect,
  onUnselect,
}: Props) {
  const selectedSet = useMemo(
    () => new Set(selectedIngredients),
    [selectedIngredients]
  );

  return (
    <View className="flex-1 p-4">
      <Text className="text-title4 text-text-strong pb-4">{categoryName}</Text>

      <View className="gap-4">
        {ingredients
          .reduce(
            (acc, _, i) =>
              i % 4 === 0 ? [...acc, ingredients.slice(i, i + 4)] : acc,
            [] as PickIngredient[][]
          )
          .map((row, rowIndex) => (
            <View key={rowIndex} className="flex-1 flex-row justify-between">
              {row.map((ingredient, index) => (
                <PressableScale
                  key={ingredient.ingredientId}
                  onPress={() => {
                    selectedSet.has(ingredient)
                      ? onUnselect(ingredient)
                      : onSelect(ingredient);
                  }}
                >
                  <PickIngredientItem
                    key={ingredient.ingredientId}
                    ingredientId={ingredient.ingredientId}
                    ingredientName={ingredient.ingredientName}
                    ingredientIconId={ingredient.ingredientIconId}
                    isSelected={selectedSet.has(ingredient)}
                  />
                </PressableScale>
              ))}
              {Array(4 - row.length)
                .fill(0)
                .map((_, i) => (
                  <View key={`empty-${i}`} className="w-[76px]" /> // TODO: 이렇게 넓이를 고정으로 주지 않고도 그리드를 만들 수 있는지 확인하기
                ))}
            </View>
          ))}
      </View>
    </View>
  );
}
