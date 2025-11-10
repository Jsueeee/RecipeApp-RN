import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { PressableScale } from "@/app/components/PressableScale";
import { usePostFridgeBasketMutation } from "@/app/hooks/mutations/usePostFridgeBasketMutation";
import { useIngredientsQuery } from "@/app/hooks/queries/useIngredientsQuery";
import { PickIngredient } from "@/app/types/domain/ingredient";
import BasketIcon from "@/assets/images/ic_basket.svg";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { PickIngredientItem } from "@/components/PickIngredientItem";
import i18n from "@/lib/i18n";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { SelectedBottomRow } from "./components/SelectedBottomRow";

const TABS = Object.values(FridgeTabs);

export default function IngredientPickScreen() {
  const router = useRouter();

  const listRef = useRef<FlashListRef<SectionRow>>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<
    PickIngredient[]
  >([]);
  const [shouldLoadData, setShouldLoadData] = useState(false);
  const { data: ingredients, isLoading } = useIngredientsQuery({
    enabled: shouldLoadData,
  });
  const { postFridgeBasket, isPostBasketPending } = usePostFridgeBasketMutation(
    {
      onSuccess: () => {
        setSelectedIngredients([]);
        router.dismissAll();
        router.push("/(fridge)/(basket)");
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const handleTabSelect = useCallback((index: number) => {
    setSelectedTabIndex(index);
    // 섹션 변경 시 리스트 최상단으로 이동
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, []);

  const handleIngredientSelect = useCallback((ingredient: PickIngredient) => {
    setSelectedIngredients((prev) => [...prev, ingredient]);
  }, []);

  const handleIngredientUnselect = useCallback((ingredient: PickIngredient) => {
    setSelectedIngredients((prev) =>
      prev.filter((i) => i.ingredientId !== ingredient.ingredientId)
    );
  }, []);

  // 화면 전환 버벅임 때문에
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        setShouldLoadData(true);
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  const filteredIngredients = useMemo(
    () =>
      ingredients
        ?.filter(
          (category) =>
            selectedTabIndex === 0 ||
            category.ingredientCategoryName === TABS[selectedTabIndex]
        )
        .filter((category) => category.ingredients.length > 0),
    [ingredients, selectedTabIndex]
  );

  type SectionRow =
    | { type: "header"; key: string; title: string }
    | {
        type: "row";
        key: string;
        items: PickIngredient[];
        addBottomGap?: boolean;
      };

  const { width } = useWindowDimensions();
  const ROW_COUNT = width >= 500 ? 6 : 4;

  const selectedSet = useMemo(
    () => new Set(selectedIngredients.map((i) => i.ingredientId)),
    [selectedIngredients]
  );

  const chunkBy = (arr: PickIngredient[], size: number) => {
    const chunks: PickIngredient[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const flatData = useMemo(() => {
    const data: SectionRow[] = [];

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
      });
    });

    return data;
  }, [filteredIngredients, ROW_COUNT]);

  const toggleIngredient = useCallback(
    (ingredient: PickIngredient) => {
      if (selectedSet.has(ingredient.ingredientId)) {
        handleIngredientUnselect(ingredient);
      } else {
        handleIngredientSelect(ingredient);
      }
    },
    [selectedSet, handleIngredientUnselect, handleIngredientSelect]
  );

  const renderItem = ({ item }: { item: SectionRow }) => {
    if (isLoading || !shouldLoadData) return null;

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
          {item.items.map((ingredient) => (
            <PickIngredientItem
              key={ingredient.ingredientId}
              ingredientId={ingredient.ingredientId}
              ingredientName={ingredient.ingredientName}
              ingredientIconId={ingredient.ingredientIconId}
              isSelected={selectedSet.has(ingredient.ingredientId)}
              onPress={() => toggleIngredient(ingredient)}
            />
          ))}

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

  const onAddBasketButtonPress = useCallback(() => {
    postFridgeBasket({
      ingredientIds: selectedIngredients.map(
        (ingredient) => ingredient.ingredientId
      ),
    });
  }, [postFridgeBasket, selectedIngredients]);

  /**
   * 냉장고 바구니 화면 이동
   */
  const onBasketButtonPress = useCallback(() => {
    router.push("/(fridge)/(basket)");
  }, []);

  /**
   * 커스텀 재료 화면 이동
   */
  const onCustomIngredientButtonPress = useCallback(() => {
    router.push("/(ingredient)/(custom)");
  }, []);

  const renderRightButtons = useCallback(() => {
    return [
      <View key="actions" className="flex-row gap-4">
        <PressableScale key="basket" onPress={onBasketButtonPress} hitSlop={4}>
          <BasketIcon width={24} height={24} />
        </PressableScale>

        <PressableScale
          key="custom"
          onPress={onCustomIngredientButtonPress}
          hitSlop={4}
          className="items-center justify-center"
        >
          <Text className="text-utility1">
            {i18n.t("custom_ingredient.button")}
          </Text>
        </PressableScale>
      </View>,
    ];
  }, [onAddBasketButtonPress]);

  return (
    <>
      <ScreenLayout
        title={i18n.t("ingredient_pick.title")}
        rightButtonIcons={renderRightButtons()}
      >
        <View>
          <CategoryTabs
            tabs={TABS}
            selectedTabIndex={selectedTabIndex}
            onSelectTabIndex={handleTabSelect}
            className="bg-white w-full"
          />
        </View>

        <FlashList
          ref={listRef}
          data={flatData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingBottom: 200 }}
          style={{ flex: 1 }}
        />
      </ScreenLayout>

      {selectedIngredients.length > 0 && (
        <SelectedBottomRow
          selectedIngredients={selectedIngredients}
          onRemovePress={handleIngredientUnselect}
          onCTAPress={onAddBasketButtonPress}
          isPostBasketPending={isPostBasketPending}
          className="absolute bottom-0 left-0 right-0"
        />
      )}

      {(isLoading || !shouldLoadData) && <DotLoadingScreen />}
    </>
  );
}
