import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React from "react";
import { View } from "react-native";

export default function DeleteAccountScreen() {
  return (
    <ScreenLayout title={i18n.t("setting.delete_account_dialog_title")}>
      <View></View>
    </ScreenLayout>
  );
}
