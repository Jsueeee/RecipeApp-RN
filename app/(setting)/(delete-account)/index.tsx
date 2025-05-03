import AlertIcon from "@/assets/images/ic_alert.svg";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

export default function DeleteAccountScreen() {
  return (
    <ScreenLayout title={i18n.t("delete_account.app_bar_title")}>
      <View className="flex-1 px-4">
        <Text className="text-title3 text-text-strong pt-3">
          {i18n.t("delete_account.title")}
        </Text>

        <View className="pt-4" />

        <View className="w-full bg-status-cautionary rounded-[12px] p-4 gap-2 items-center">
          <AlertIcon width={18} height={18} color="#FD8000" />

          <Text className="text-body2 text-strong-cautionary">
            {i18n.t("delete_account.message")}
          </Text>
        </View>
      </View>
    </ScreenLayout>
  );
}
