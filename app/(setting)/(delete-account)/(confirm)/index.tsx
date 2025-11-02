import { CTAButton } from "@/components/CTAButton";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { useState } from "react";
import { Text, View } from "react-native";
import { DeleteAccountReasonOptions } from "./components/DeleteAccountReasonOptions";
import { useDeleteAccountMutation } from "@/app/hooks/mutations/useDeleteAccountMutation";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";

export default function DeleteAccountConfirmScreen() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const { deleteAccount } = useDeleteAccountMutation({
    onSuccess: () => {
      router.dismissAll();
      router.replace("/(setting)/(delete-account)/(success)"); // 탈퇴 성공 화면으로 이동
    },
    onError: () => {
      Toast.error(i18n.t("delete_account_confirm.error"));
    },
  });

  const onCTAButtonPress = () => {
    if (selectedOption === null) return;

    const selectedOptionText = i18n.t(
      `delete_account_confirm.option_${selectedOption}`
    );

    deleteAccount({
      withdrawalReason: selectedOptionText,
    });
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
