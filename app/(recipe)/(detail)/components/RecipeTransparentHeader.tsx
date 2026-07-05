import { DebouncedTouchableOpacity } from "@/app/components/DebouncedPressable";
import IC_CHEVRON_LEFT from "@/assets/images/ic_chevron_left.svg";
import IC_MORE from "@/assets/images/ic_more.svg";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  isMyRecipe: boolean;
  onMoreClick: () => void;
}

export const RecipeTransparentHeader = ({ isMyRecipe, onMoreClick }: Props) => {
  const insets = useSafeAreaInsets();

  const onBackClick = () => {
    router.back();
  };

  return (
    <>
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top + 56,
        }}
      />

      <View
        className="flex-row items-center justify-between px-4 w-full z-10"
        style={{ top: insets.top + 16 }}
      >
        <DebouncedTouchableOpacity onPress={onBackClick} hitSlop={8}>
          <IC_CHEVRON_LEFT width={24} height={24} color="#FFFFFF" />
        </DebouncedTouchableOpacity>

        {!isMyRecipe && (
          <DebouncedTouchableOpacity
            onPress={onMoreClick}
            activeOpacity={0.8}
            hitSlop={8}
          >
            <IC_MORE width={24} height={24} color="#FFFFFF" />
          </DebouncedTouchableOpacity>
        )}
      </View>
    </>
  );
};
