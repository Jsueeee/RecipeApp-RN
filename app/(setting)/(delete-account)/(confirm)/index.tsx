import { CTAButton } from "@/components/CTAButton";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { useState } from "react";
import { Text, View } from "react-native";
import { DeleteAccountReasonOptions } from "./components/DeleteAccountReasonOptions";

export default function DeleteAccountConfirmScreen() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const onCTAButtonPress = () => {
    console.log(selectedOption);
  };

  return (
    <ScreenLayout
      title={i18n.t("delete_account_confirm.app_bar_title")}
      isScrollEnabled={true}
      footer={
        <CTAButton
          buttonLabel={i18n.t("delete_account_confirm.cta")}
          disabled={selectedOption === null}
          onPress={onCTAButtonPress}
          className="px-4 pb-[22px] mt-3"
        />
      }
    >
      <View className="flex-1 px-4">
        <Text className="text-title3 text-text-strong mt-3">
          {i18n.t("delete_account_confirm.title")}
        </Text>

        <Text className="text-body2 text-text-alternative mt-2">
          {i18n.t("delete_account_confirm.message")}
        </Text>

        <DeleteAccountReasonOptions
          onSelect={(option) => {
            setSelectedOption(option);
          }}
        />
      </View>
    </ScreenLayout>
  );
}
