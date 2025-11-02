import IC_TOMATO from "@/assets/images/ic_tomato.svg";
import { CTAButton } from "@/components/CTAButton";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { BackHandler, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function DeleteAccountSuccessScreen() {
  const onCTAButtonPress = () => {
    router.dismissAll();
    router.replace("/(auth)");
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [])
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
