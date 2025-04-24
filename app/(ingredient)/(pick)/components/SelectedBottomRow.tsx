import { PickIngredient } from "@/app/types/domain/ingredient";
import { CTAButton } from "@/components/CTAButton";
import { SelectedIngredientItem } from "@/components/SelectedIngredientItem";
import i18n from "@/lib/i18n";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface Props {
  selectedIngredients: PickIngredient[];
  onRemovePress: (ingredient: PickIngredient) => void;
  onCTAPress: () => void;
  className?: string;
}

export const SelectedBottomRow = ({
  selectedIngredients,
  onRemovePress,
  onCTAPress,
  className,
}: Props) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (selectedIngredients.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedIngredients.length]);

  return (
    <View
      className={`flex-1 bg-white ${className}`}
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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

      <CTAButton
        buttonLabel={i18n.t("ingredient_pick.add", {
          count: selectedIngredients.length,
        })}
        onPress={onCTAPress}
        className="px-4 mb-safe"
      />
    </View>
  );
};
