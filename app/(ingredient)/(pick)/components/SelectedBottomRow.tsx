import { TutorialAnchor, useTutorial } from "@/app/tutorial";
import { PickIngredient } from "@/app/types/domain/ingredient";
import { CTAButton } from "@/components/CTAButton";
import { SelectedIngredientItem } from "@/components/SelectedIngredientItem";
import i18n from "@/lib/i18n";
import React, { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface Props {
  selectedIngredients: PickIngredient[];
  onRemovePress: (ingredient: PickIngredient) => void;
  onCTAPress: () => void;
  isPostBasketPending: boolean;
  className?: string;
}

export const SelectedBottomRow = ({
  selectedIngredients,
  onRemovePress,
  onCTAPress,
  isPostBasketPending,
  className,
}: Props) => {
  const { registerAnchorAction } = useTutorial();
  const flatListRef = useRef<FlatList>(null);
  const preLength = useRef(selectedIngredients.length);

  useEffect(() => {
    registerAnchorAction("picker-cta", onCTAPress);
  }, [onCTAPress, registerAnchorAction]);

  useEffect(() => {
    if (selectedIngredients.length > preLength.current) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }

    preLength.current = selectedIngredients.length;
  }, [selectedIngredients.length]);

  return (
    <View
      className={`flex-1 bg-white pt-1 pb-safe ${className}`}
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
    >
      <FlatList
        ref={flatListRef}
        data={selectedIngredients}
        renderItem={({ item }) => (
          <SelectedIngredientItem
            ingredientId={item.ingredientId}
            ingredientName={item.ingredientName}
            ingredientIconId={item.ingredientIconId}
            onRemovePress={() => onRemovePress(item)}
          />
        )}
        keyExtractor={(item) => item.ingredientId.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 16,
          flexGrow: 1,
        }}
        className="flex-1 my-3"
      />

      <View className={`px-4 pt-1 ${Platform.OS === "ios" ? "pb-[22px]" : ""}`}>
        <TutorialAnchor id="picker-cta">
          <CTAButton
            buttonLabel={i18n.t("ingredient_pick.add", {
              count: selectedIngredients.length,
            })}
            isLoading={isPostBasketPending}
            onPress={onCTAPress}
          />
        </TutorialAnchor>
      </View>
    </View>
  );
};
