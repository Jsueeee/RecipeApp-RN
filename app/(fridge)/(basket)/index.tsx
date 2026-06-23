import { CategorizedIngredientsGroup } from "@/app/(tabs)/(fridge)/components/CategorizedIngredientsGroup";
import { usePostFridgeMutation } from "@/app/hooks/mutations/usePostFridgeMutation";
import { useFridgeBasketQuery } from "@/app/hooks/queries/useFridgeBasketQuery";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import {
  useGuestFridgeBasketQuery,
  useGuestPostFridgeMutation,
} from "@/app/lib/storage/guestFridge";
import { TutorialAnchor, useTutorial } from "@/app/tutorial";
import { CategorizedFridgeBasket, Ingredient } from "@/app/types/domain/fridge";
import { mapFridgeBasketIngredient } from "@/app/types/mappers/fridge";
import { CTAButton } from "@/components/CTAButton";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { View } from "react-native";

export default function IngredientBasketScreen() {
  const { registerAnchorAction } = useTutorial();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStatus();
  const remoteBasketQuery = useFridgeBasketQuery({ enabled: isAuthenticated });
  const guestBasketQuery = useGuestFridgeBasketQuery({
    enabled: !isAuthenticated,
  });
  const categorizedFridgeBaskets = isAuthenticated
    ? remoteBasketQuery.categorizedFridgeBaskets
    : guestBasketQuery.categorizedFridgeBaskets;
  const isLoading =
    isAuthLoading ||
    (isAuthenticated ? remoteBasketQuery.isLoading : guestBasketQuery.isLoading);

  const router = useRouter();

  const { postFridge, isPending } = usePostFridgeMutation({
    onSuccess: () => {
      router.replace("/(tabs)/(fridge)");
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const { postGuestFridge, isGuestPending } = useGuestPostFridgeMutation({
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
    index,
  }: {
    item: CategorizedFridgeBasket;
    index: number;
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
      firstIngredientAnchorId={
        index === 0 ? "fridge-basket-first-ingredient" : undefined
      }
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
      <FlashList
        data={categorizedFridgeBaskets}
        renderItem={renderItem}
        keyExtractor={(item) => item.ingredientCategoryId.toString()}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
      />
    );
  };

  const onCTAButtonPress = useCallback(() => {
    if (!isAuthenticated) {
      postGuestFridge();
      return;
    }

    postFridge();
  }, [isAuthenticated, postFridge, postGuestFridge]);

  useEffect(() => {
    registerAnchorAction("fridge-basket-save", onCTAButtonPress);
  }, [onCTAButtonPress, registerAnchorAction]);

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
            <View className="pb-[22px]">
              <TutorialAnchor id="fridge-basket-save">
                <CTAButton
                  buttonLabel={i18n.t("fridge_basket.cta")}
                  isLoading={isAuthenticated ? isPending : isGuestPending}
                  onPress={onCTAButtonPress}
                />
              </TutorialAnchor>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
