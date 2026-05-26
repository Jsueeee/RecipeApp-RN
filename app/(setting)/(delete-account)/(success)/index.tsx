import IC_TOMATO from "@/assets/images/ic_tomato.svg";
import { setAuthRedirectSuppressed } from "@/app/lib/api/client";
import { CTAButton } from "@/components/CTAButton";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { CommonActions, usePreventRemove } from "@react-navigation/native";
import { BackHandler, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";

type GestureNavigation = {
  getParent?: () => unknown;
  setOptions?: (options: {
    gestureEnabled?: boolean;
    fullScreenGestureEnabled?: boolean;
  }) => void;
};

export default function DeleteAccountSuccessScreen() {
  const navigation = useNavigation();
  const rootNavigation = useNavigation("/");
  const [isLeavingByCTA, setIsLeavingByCTA] = useState(false);

  const onCTAButtonPress = useCallback(() => {
    setAuthRedirectSuppressed(false);
    setIsLeavingByCTA(true);
  }, []);

  usePreventRemove(!isLeavingByCTA, () => {});

  useEffect(() => {
    if (!isLeavingByCTA) return;

    rootNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(auth)" }],
      }),
    );
  }, [isLeavingByCTA, rootNavigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      let currentNavigation: unknown = navigation;
      while (currentNavigation) {
        const targetNavigation = currentNavigation as GestureNavigation;

        targetNavigation.setOptions?.({
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
        });

        currentNavigation = targetNavigation.getParent?.();
      }

      return () => {
        subscription.remove();
      };
    }, [navigation]),
  );

  return (
    <ScreenLayout isShowHeader={false}>
      <View className="items-center justify-center flex-1">
        <IC_TOMATO width={72} />

        <Text className="text-title3 text-text-strong mt-4">
          {i18n.t("delete_account_success.title")}
        </Text>

        <Text className="text-body2 text-text-alternative mt-2 text-center">
          {i18n.t("delete_account_success.message")}
        </Text>
      </View>

      <CTAButton
        buttonLabel={i18n.t("delete_account_success.cta")}
        onPress={onCTAButtonPress}
        className="mx-4 mb-[22px]"
      />
    </ScreenLayout>
  );
}
