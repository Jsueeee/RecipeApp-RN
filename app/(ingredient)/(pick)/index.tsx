import { CategoryTabs } from "@/app/(tabs)/(fridge)/components/CategoryTabs";
import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { PressableScale } from "@/app/components/PressableScale";
import { usePostFridgeBasketMutation } from "@/app/hooks/mutations/usePostFridgeBasketMutation";
import { useIngredientsQuery } from "@/app/hooks/queries/useIngredientsQuery";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import { useLoginPrompt } from "@/app/hooks/useLoginPrompt";
import { useGuestPostFridgeBasketMutation } from "@/app/lib/storage/guestFridge";
import { TutorialAnchor, useTutorial } from "@/app/tutorial";
import { PickIngredient } from "@/app/types/domain/ingredient";
import BasketIcon from "@/assets/images/ic_basket.svg";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { PickIngredientList } from "./components/PickIngredientList";
import { SelectedBottomRow } from "./components/SelectedBottomRow";
import { getLocalPickIngredients } from "./localPickIngredients";

const TABS = Object.values(FridgeTabs);

export default function IngredientPickScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStatus();
  const promptLogin = useLoginPrompt();
  const { state: tutorialState } = useTutorial();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<
    PickIngredient[]
  >([]);
  const [shouldLoadData, setShouldLoadData] = useState(false);

  const localIngredients = useMemo(() => getLocalPickIngredients(), []);
  const { data: remoteIngredients, isLoading } = useIngredientsQuery({
    enabled: isAuthenticated && shouldLoadData,
  });
  const { postFridgeBasket, isPostBasketPending } = usePostFridgeBasketMutation(
    {
      onSuccess: () => {
        setSelectedIngredients([]);
        router.push("/(fridge)/(basket)");
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
  const { postGuestFridgeBasket, isPostGuestBasketPending } =
    useGuestPostFridgeBasketMutation({
      onSuccess: () => {
        setSelectedIngredients([]);
        router.push("/(fridge)/(basket)");
      },
      onError: (error) => {
        console.error(error);
      },
    });

  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedIngredients([]);
    }
  }, [isAuthenticated]);

  const handleTabSelect = useCallback((index: number) => {
    setSelectedTabIndex(index);
  }, []);

  const handleIngredientSelect = useCallback((ingredient: PickIngredient) => {
    setSelectedIngredients((prev) => [...prev, ingredient]);
  }, []);

  const handleIngredientUnselect = useCallback((ingredient: PickIngredient) => {
    setSelectedIngredients((prev) =>
      prev.filter((i) => i.ingredientId !== ingredient.ingredientId),
    );
  }, []);

  // 화면 전환 버벅임 때문에 로그인 상태에서만 서버 데이터를 지연 로드한다.
  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        setShouldLoadData(false);
        return;
      }

      const timer = setTimeout(() => {
        setShouldLoadData(true);
      }, 100);

      return () => clearTimeout(timer);
    }, [isAuthenticated]),
  );

  const onAddBasketButtonPress = useCallback(() => {
    if (!isAuthenticated) {
      const isTutorialInProgress =
        tutorialState.hasStarted &&
        tutorialState.phase !== "idle" &&
        tutorialState.phase !== "done";

      if (!isTutorialInProgress) {
        promptLogin();
        return;
      }

      postGuestFridgeBasket(selectedIngredients);
      return;
    }

    postFridgeBasket({
      ingredientIds: selectedIngredients.map(
        (ingredient) => ingredient.ingredientId,
      ),
    });
  }, [
    isAuthenticated,
    postFridgeBasket,
    postGuestFridgeBasket,
    promptLogin,
    selectedIngredients,
    tutorialState.hasStarted,
    tutorialState.phase,
  ]);

  /** 냉장고 바구니 화면 이동 */
  const onBasketButtonPress = useCallback(() => {
    router.push("/(fridge)/(basket)");
  }, [router]);

  /** 커스텀 재료 화면 이동 */
  const onCustomIngredientButtonPress = useCallback(() => {
    if (!isAuthenticated) {
      promptLogin();
      return;
    }

    router.push("/(ingredient)/(custom)");
  }, [isAuthenticated, promptLogin, router]);

  const renderRightButtons = useCallback(() => {
    return [
      <View key="actions" className="flex-row gap-4">
        <PressableScale key="basket" onPress={onBasketButtonPress} hitSlop={4}>
          <BasketIcon width={24} height={24} />
        </PressableScale>

        <TutorialAnchor id="picker-custom">
          <PressableScale
            onPress={onCustomIngredientButtonPress}
            hitSlop={4}
            className="items-center justify-center"
          >
            <Text className="text-utility1">
              {i18n.t("custom_ingredient.button")}
            </Text>
          </PressableScale>
        </TutorialAnchor>
      </View>,
    ];
  }, [onBasketButtonPress, onCustomIngredientButtonPress]);

  const displayedIngredients = isAuthenticated
    ? remoteIngredients
    : localIngredients;
  const isScreenLoading =
    isAuthLoading || (isAuthenticated && (isLoading || !shouldLoadData));

  return (
    <>
      <ScreenLayout
        title={i18n.t("ingredient_pick.title")}
        rightButtonIcons={renderRightButtons()}
      >
        <TutorialAnchor id="picker-categories" style={{ height: 60 }}>
          <CategoryTabs
            tabs={TABS}
            selectedTabIndex={selectedTabIndex}
            onSelectTabIndex={handleTabSelect}
            className="bg-white w-full"
          />
        </TutorialAnchor>

        <PickIngredientList
          ingredients={displayedIngredients}
          selectedTabIndex={selectedTabIndex}
          selectedIngredients={selectedIngredients}
          isLoading={isScreenLoading}
          isReady={!isAuthenticated || shouldLoadData}
          onSelectIngredient={handleIngredientSelect}
          onUnselectIngredient={handleIngredientUnselect}
        />
      </ScreenLayout>

      {selectedIngredients.length > 0 && (
        <SelectedBottomRow
          selectedIngredients={selectedIngredients}
          onRemovePress={handleIngredientUnselect}
          onCTAPress={onAddBasketButtonPress}
          isPostBasketPending={
            isAuthenticated ? isPostBasketPending : isPostGuestBasketPending
          }
          className="absolute bottom-0 left-0 right-0"
        />
      )}

      {isScreenLoading && <DotLoadingScreen />}
    </>
  );
}
