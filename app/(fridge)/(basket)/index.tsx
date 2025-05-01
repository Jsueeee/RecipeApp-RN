import { CategorizedIngredientsGroup } from "@/app/(tabs)/(fridge)/components/CategorizedIngredientsGroup";
import { useFridgeBasketQuery } from "@/app/hooks/queries/useFridgeBasketQuery";
import { CategorizedFridgeBasket, Ingredient } from "@/app/types/domain/fridge";
import { mapFridgeBasketIngredient } from "@/app/types/mappers/fridge";
import { CTAButton } from "@/components/CTAButton";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { LinearGradient } from "expo-linear-gradient";

import { FlatList, View } from "react-native";

export default function IngredientBasketScreen() {
  const { categorizedFridgeBaskets, isLoading, isError } =
    useFridgeBasketQuery();

  const onIngredientItemClick = (ingredient: Ingredient) => {
    console.log(ingredient);
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
    />
  );

  const renderContent = () => {
    if (isLoading) {
      return <DotLoadingScreen />;
    }

    if (categorizedFridgeBaskets?.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <EmptyPlaceholder
            title={i18n.t("home.fridge_is_empty")}
            description={i18n.t("home.fridge_is_empty_sub")}
          />
        </View>
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

  return (
    <ScreenLayout
      title={i18n.t("fridge_basket.header")}
      backgroundColor="bg-alternative"
    >
      {renderContent()}

      <View className="absolute bottom-0 left-0 right-0">
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
          style={{ height: 40 }}
        />

        <View className="bg-white px-4 pb-[22px]">
          <CTAButton
            buttonLabel={i18n.t("fridge_basket.cta")}
            onPress={() => {
              console.log("cta");
            }}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}
