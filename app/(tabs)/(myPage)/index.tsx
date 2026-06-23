import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import { useLoginPrompt } from "@/app/hooks/useLoginPrompt";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateRecipeButton } from "./components/CreateRecipeButton";
import { MyPageHeader } from "./components/MyPageHeader";
import { MyProfile } from "./components/MyProfile";
import { MyRecipeSummary } from "./components/MyRecipeSummary";
import { MyScrapSummary } from "./components/MyScrapSummary";

export default function MyPageScreen() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStatus();
  const promptLogin = useLoginPrompt();
  const { userInfo, isLoading } = useUserInfoQuery({
    enabled: isAuthenticated,
  });

  const onProfilePress = () => {
    if (!isAuthenticated) {
      promptLogin();
      return;
    }

    router.push("/(myPage)/(profile)");
  };
  const isPageLoading = isAuthLoading || (isAuthenticated && isLoading);

  return (
    <SafeAreaView className="flex-1 bg-background-alternative">
      {isPageLoading ? (
        <DotLoadingScreen />
      ) : (
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          >
            <MyPageHeader showSetting={isAuthenticated} />

            <MyProfile
              profileImage={userInfo?.profileImageUrl}
              showGuestAvatar={!isAuthenticated}
              nickname={
                isAuthenticated
                  ? userInfo?.nickname
                  : "로그인하고 모든 기능 사용하기"
              }
              onPress={onProfilePress}
            />

            <MyScrapSummary
              className="mt-6"
              isAuthenticated={isAuthenticated}
              onRequireLogin={promptLogin}
              blogScrapCount={
                isAuthenticated ? (userInfo?.blogScrapCnt ?? 0) : 0
              }
              youtubeScrapCount={
                isAuthenticated ? (userInfo?.youtubeScrapCnt ?? 0) : 0
              }
              recipeScrapCount={
                isAuthenticated ? (userInfo?.recipeScrapCnt ?? 0) : 0
              }
            />

            <MyRecipeSummary
              isAuthenticated={isAuthenticated}
              onRequireLogin={promptLogin}
              recipes={
                isAuthenticated ? (userInfo?.userRecipeSummaries ?? []) : []
              }
              className="mt-10 flex-1"
            />
          </ScrollView>

          <CreateRecipeButton />
        </View>
      )}
    </SafeAreaView>
  );
}
