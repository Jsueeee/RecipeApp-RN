import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import React from "react";
import { MyPageHeader } from "./components/MyPageHeader";
import { MyProfile } from "./components/MyProfile";
import { MyScrapSummary } from "./components/MyScrapSummary";
import { MyRecipeSummary } from "./components/MyRecipeSummary";
import { router } from "expo-router";
export default function MyPageScreen() {
  const { data: userInfo } = useUserInfoQuery();

  const onProfilePress = () => {
    router.push("/(myPage)/(profile)");
  };

  return (
    <ScreenLayout
      isShowHeader={false}
      isScrollEnabled={true}
      backgroundColor="background-alternative"
    >
      <MyPageHeader />

      <MyProfile
        profileImage={userInfo?.profileImageUrl}
        nickname={userInfo?.nickname}
        onPress={onProfilePress}
      />

      <MyScrapSummary
        className="mt-6 flex-1"
        blogScrapCount={userInfo?.blogScrapCnt ?? 0}
        youtubeScrapCount={userInfo?.youtubeScrapCnt ?? 0}
        recipeScrapCount={userInfo?.recipeScrapCnt ?? 0}
      />

      <MyRecipeSummary
        recipes={userInfo?.userRecipeSummaries ?? []}
        className="mt-10 flex-1"
      />
    </ScreenLayout>
  );
}
