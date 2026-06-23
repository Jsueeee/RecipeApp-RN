import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { TutorialAnchor, useTutorial } from "@/app/tutorial";
import {
  CategorizedPickIngredients,
  PickIngredient,
} from "@/app/types/domain/ingredient";
import { PickIngredientItem } from "@/components/PickIngredientItem";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Text, useWindowDimensions, View } from "react-native";

const TABS = Object.values(FridgeTabs);

type SectionRow =
  | { type: "header"; key: string; title: string }
  | {
      type: "row";
      key: string;
      items: PickIngredient[];
      addBottomGap?: boolean;
    };

interface Props {
  ingredients: CategorizedPickIngredients[] | undefined;
  selectedTabIndex: number;
  selectedIngredients?: PickIngredient[];
  isLoading?: boolean;
  isReady?: boolean;
  readOnly?: boolean;
  onSelectIngredient?: (ingredient: PickIngredient) => void;
  onUnselectIngredient?: (ingredient: PickIngredient) => void;
}

const chunkBy = (arr: PickIngredient[], size: number) => {
  const chunks: PickIngredient[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export function PickIngredientList({
  ingredients,
  selectedTabIndex,
  selectedIngredients = [],
  isLoading = false,
  isReady = true,
  readOnly = false,
  onSelectIngredient,
  onUnselectIngredient,
}: Props) {
  const { reportProgress, registerAnchorAction } = useTutorial();
  const listRef = useRef<FlashListRef<SectionRow>>(null);
  const { width } = useWindowDimensions();
  const ROW_COUNT = width >= 500 ? 6 : 4;

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [selectedTabIndex]);

  const filteredIngredients = useMemo(
    () =>
      ingredients
        ?.filter(
          (category) =>
            selectedTabIndex === 0 ||
            category.ingredientCategoryName === TABS[selectedTabIndex],
        )
        .filter((category) => category.ingredients.length > 0),
    [ingredients, selectedTabIndex],
  );

  const selectedSet = useMemo(
    () => new Set(selectedIngredients.map((i) => i.ingredientId)),
    [selectedIngredients],
  );

  const { flatData, tutorialIngredients } = useMemo(() => {
    const data: SectionRow[] = [];
    const tutorialItems: PickIngredient[] = [];

    (filteredIngredients ?? []).forEach((category, categoryIndex, all) => {
      data.push({
        type: "header",
        key: `h:${category.ingredientCategoryId}`,
        title: category.ingredientCategoryName,
      });

      const rows = chunkBy(category.ingredients, ROW_COUNT);
      rows.forEach((rowItems, rowIndex) => {
        const isLastRowInCategory = rowIndex === rows.length - 1;
        const addBottomGap =
          isLastRowInCategory && categoryIndex < all.length - 1;

        data.push({
          type: "row",
          key: `r:${category.ingredientCategoryId}:${rowIndex}`,
          items: rowItems,
          addBottomGap,
        });

        rowItems.forEach((ingredient) => {
          if (tutorialItems.length < 2) {
            tutorialItems.push(ingredient);
          }
        });
      });
    });

    return { flatData: data, tutorialIngredients: tutorialItems };
  }, [filteredIngredients, ROW_COUNT]);

  const tutorialIngredientIds = useMemo(
    () => tutorialIngredients.map((ingredient) => ingredient.ingredientId),
    [tutorialIngredients],
  );

  const toggleIngredient = useCallback(
    (ingredient: PickIngredient) => {
      if (readOnly) return;

      if (selectedSet.has(ingredient.ingredientId)) {
        onUnselectIngredient?.(ingredient);
        return;
      }

      if (ingredient.ingredientId === tutorialIngredientIds[0]) {
        reportProgress("picker-picked-1");
      }
      if (ingredient.ingredientId === tutorialIngredientIds[1]) {
        reportProgress("picker-picked-2");
      }
      onSelectIngredient?.(ingredient);
    },
    [
      onSelectIngredient,
      onUnselectIngredient,
      readOnly,
      reportProgress,
      selectedSet,
      tutorialIngredientIds,
    ],
  );

  const getTutorialIngredientAnchorId = useCallback(
    (ingredientId: number) => {
      if (readOnly) return null;
      if (ingredientId === tutorialIngredientIds[0]) {
        return "picker-ingredient-first" as const;
      }
      if (ingredientId === tutorialIngredientIds[1]) {
        return "picker-ingredient-second" as const;
      }
      return null;
    },
    [readOnly, tutorialIngredientIds],
  );

  useEffect(() => {
    if (readOnly) return;

    const [firstIngredient, secondIngredient] = tutorialIngredients;
    if (firstIngredient) {
      registerAnchorAction("picker-ingredient-first", () => {
        toggleIngredient(firstIngredient);
      });
    }
    if (secondIngredient) {
      registerAnchorAction("picker-ingredient-second", () => {
        toggleIngredient(secondIngredient);
      });
    }
  }, [
    readOnly,
    registerAnchorAction,
    toggleIngredient,
    tutorialIngredients,
  ]);

  const renderItem = ({ item }: { item: SectionRow }) => {
    if (isLoading || !isReady) return null;

    if (item.type === "header") {
      return (
        <View className="px-4 pt-4 pb-2 bg-white">
          <Text className="text-title4 text-text-strong">{item.title}</Text>
        </View>
      );
    }

    return (
      <View
        className="px-4 py-2"
        style={item.addBottomGap ? { marginBottom: 20 } : undefined}
      >
        <View className="flex-row justify-between">
          {item.items.map((ingredient) => {
            const anchorId = getTutorialIngredientAnchorId(
              ingredient.ingredientId,
            );
            const ingredientItem = (
              <PickIngredientItem
                ingredientId={ingredient.ingredientId}
                ingredientName={ingredient.ingredientName}
                ingredientIconId={ingredient.ingredientIconId}
                isSelected={selectedSet.has(ingredient.ingredientId)}
                onPress={() => toggleIngredient(ingredient)}
                disabled={readOnly}
              />
            );

            if (!anchorId) {
              return (
                <React.Fragment key={ingredient.ingredientId}>
                  {ingredientItem}
                </React.Fragment>
              );
            }

            return (
              <TutorialAnchor
                key={ingredient.ingredientId}
                id={anchorId}
                style={{ width: 76, height: 76 }}
              >
                {ingredientItem}
              </TutorialAnchor>
            );
          })}

          {(() => {
            const emptyCount = Math.max(0, ROW_COUNT - item.items.length);
            if (emptyCount === 0) return null;
            return Array.from({ length: emptyCount }).map((_, i) => (
              <View key={`empty-${item.key}-${i}`} className="w-[76px]" />
            ));
          })()}
        </View>
      </View>
    );
  };

  return (
    <FlashList
      ref={listRef}
      data={flatData}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.key}
      contentContainerStyle={{ paddingBottom: 200 }}
      style={{ flex: 1 }}
      getItemType={(item) => (item.type === "header" ? "header" : "row")}
    />
  );
}
