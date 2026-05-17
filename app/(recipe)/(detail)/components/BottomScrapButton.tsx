import { useRecipeScrapMutation } from "@/app/hooks/mutations/useRecipeScrapMutation";
import { RecipeDetail } from "@/app/types/domain/recipe";
import HeartFillIcon from "@/assets/images/ic_heart_fill.svg";
import HeartStrokeIcon from "@/assets/images/ic_heart_stroke.svg";
import { CTAButton } from "@/components/CTAButton";
import i18n from "@/lib/i18n";
import React from "react";
import { LayoutChangeEvent } from "react-native";
import { impactLight } from "@/app/lib/haptics";

interface Props {
  recipeDetail: RecipeDetail | undefined;
  onLayout: (e: LayoutChangeEvent) => void;
}

export const BottomScrapButton = ({ recipeDetail, onLayout }: Props) => {
  const { addScrap, removeScrap, isLoading } = useRecipeScrapMutation();

  const onPress = () => {
    if (recipeDetail === undefined) return;

    impactLight();

    if (recipeDetail.isScrap) {
      removeScrap(recipeDetail.id);
    } else {
      addScrap(recipeDetail.id);
    }
  };

  return (
    <CTAButton
      buttonLabel={
        recipeDetail?.isScrap
          ? i18n.t("recipe_detail.bottom_remove_scrap_button")
          : i18n.t("recipe_detail.bottom_scrap_button")
      }
      variant={recipeDetail?.isScrap ? "border" : "active"}
      icon={
        recipeDetail?.isScrap ? (
          <HeartFillIcon width={20} height={20} color="#4BD2B0" />
        ) : (
          <HeartStrokeIcon width={20} height={20} color="#FFFFFF" />
        )
      }
      disabled={!recipeDetail}
      onPress={onPress}
      className="flex-1"
      onLayout={onLayout}
    />
  );
};
