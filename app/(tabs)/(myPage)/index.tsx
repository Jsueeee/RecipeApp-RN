import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import React from "react";
import { MyPageHeader } from "./components/MyPageHeader";
import { MyProfile } from "./components/MyProfile";
import { MyScrapSummary } from "./components/MyScrapSummary";

export default function MyPageScreen() {
  const { data: userInfo } = useUserInfoQuery();

  const onProfilePress = () => {
    console.log("profile press");
    // TODO : 프로필 설정 페이지로 이동
  };

  return (
    <ScreenLayout isShowHeader={false} backgroundColor="background-alternative">
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
    </ScreenLayout>
  );
}
