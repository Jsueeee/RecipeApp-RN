import { CategorizedIngredientsGroup } from "@/app/(tabs)/(fridge)/components/CategorizedIngredientsGroup";
import { usePostFridgeMutation } from "@/app/hooks/mutations/usePostFridgeMutation";
import { useFridgeBasketQuery } from "@/app/hooks/queries/useFridgeBasketQuery";
import { CategorizedFridgeBasket, Ingredient } from "@/app/types/domain/fridge";
import { mapFridgeBasketIngredient } from "@/app/types/mappers/fridge";
import { CTAButton } from "@/components/CTAButton";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";

export default function IngredientBasketScreen() {
  const { categorizedFridgeBaskets, isLoading, isError } =
    useFridgeBasketQuery();

  const router = useRouter();

  const { postFridge, isPending } = usePostFridgeMutation({
    onSuccess: () => {
      router.replace("/(tabs)/(fridge)");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onIngredientItemClick = (ingredient: Ingredient) => {
    router.push({
      pathname: "/(fridge)/(basket)/(edit)",
      params: {
        id: ingredient.fridgeId,
        ingredientName: ingredient.name,
        ingredientIconId: ingredient.ingredientIconId,
        expiredAt: ingredient.expiredAt,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      },
    });
  };

  const renderItem = ({
    item: category,
  }: {
    item: CategorizedFridgeBasket;
  }) => (
    <CategorizedIngredientsGroup
      key={category.ingredientCategoryName}
      categoryName={category.ingredientCategoryName}
      ingredients={category.fridgeBaskets.map((ingredient) =>
        mapFridgeBasketIngredient(
          ingredient,
          category.ingredientCategoryId,
          category.ingredientCategoryName
        )
      )}
      onIngredientItemClick={onIngredientItemClick}
      isExpiredAtPlaceholderShow={true}
    />
  );

  const onEmptyPlaceHolderCTAClick = () => {
    router.back();
  };

  const renderContent = () => {
    if (isLoading || !categorizedFridgeBaskets) {
      return <DotLoadingScreen />;
    }

    if (categorizedFridgeBaskets?.length === 0) {
      return (
        <EmptyPlaceholder
          title={i18n.t("fridge_basket.empty_place_holder_title")}
          description={i18n.t("fridge_basket.empty_place_holder_desc")}
          buttonLabel={i18n.t("fridge_basket.empty_place_holder_cta")}
          onPress={onEmptyPlaceHolderCTAClick}
        />
      );
    }

    return (
      <FlatList
        data={categorizedFridgeBaskets}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        className="flex-1 pt-3 px-4"
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    );
  };

  const onCTAButtonPress = () => {
    postFridge();
  };

  return (
    <>
      <ScreenLayout
        title={i18n.t("fridge_basket.header")}
        backgroundColor="background-alternative"
      >
        {renderContent()}
      </ScreenLayout>

      {categorizedFridgeBaskets && categorizedFridgeBaskets.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0">
          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
            style={{ height: 40 }}
          />

          <View className="bg-white px-4 pb-safe">
            <CTAButton
              buttonLabel={i18n.t("fridge_basket.cta")}
              isLoading={isPending}
              onPress={onCTAButtonPress}
              className="pb-[22px]"
            />
          </View>
        </View>
      )}
    </>
  );
}
