import { ScrapItem } from "@/app/(tabs)/(myPage)/components/MyScrapSummary";
import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import AlertIcon from "@/assets/images/ic_alert.svg";
import { CTAButton } from "@/components/CTAButton";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { DeleteAccountAgreeButton } from "./components/DeleteAccountAgreeButton";

export default function DeleteAccountScreen() {
  const { userInfo } = useUserInfoQuery();
  const [isAgree, setIsAgree] = useState(false);

  const onCTAButtonPress = () => {
    router.push("/(setting)/(delete-account)/(confirm)");
  };

  return (
    <ScreenLayout
      title={i18n.t("delete_account.app_bar_title")}
      isScrollEnabled={true}
      footer={
        <>
          <DeleteAccountAgreeButton
            isAgree={isAgree}
            onPress={() => setIsAgree((prev) => !prev)}
          />

          <CTAButton
            buttonLabel={i18n.t("delete_account.cta")}
            onPress={onCTAButtonPress}
            disabled={!isAgree}
            className="px-4 pb-[22px] mt-3"
          />
        </>
      }
    >
      <View className="flex-1 px-4">
        <Text className="text-title3 text-text-strong pt-3">
          {i18n.t("delete_account.title")}
        </Text>

        <View className="w-full bg-status-cautionary rounded-[12px] p-4 gap-2 items-center mt-4">
          <AlertIcon width={18} height={18} color="#FD8000" />

          <Text className="text-body2 text-strong-cautionary text-center">
            {i18n.t("delete_account.message")}
          </Text>
        </View>

        <Text className="text-title3 text-text-strong mt-10">
          {i18n.t("delete_account.history", {
            nickname: userInfo?.nickname,
          })}
        </Text>

        <View className="flex-row items-center gap-2 mt-5">
          <ScrapItem
            title={i18n.t("myPage.scrap_blog_title")}
            count={userInfo?.blogScrapCnt ?? 0}
            backgroundColor="fill-subtle"
            onPress={() => {}}
          />
          <ScrapItem
            title={i18n.t("myPage.scrap_youtube_title")}
            count={userInfo?.youtubeScrapCnt ?? 0}
            backgroundColor="fill-subtle"
            onPress={() => {}}
          />
          <ScrapItem
            title={i18n.t("myPage.scrap_recipe_title")}
            count={userInfo?.recipeScrapCnt ?? 0}
            backgroundColor="fill-subtle"
            onPress={() => {}}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}
