import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
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
  const { userInfo, isLoading } = useUserInfoQuery();

  const onProfilePress = () => {
    router.push("/(myPage)/(profile)");
  };

  return (
    <SafeAreaView className="flex-1 bg-background-alternative">
      {isLoading ? (
        <DotLoadingScreen />
      ) : (
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          >
            <MyPageHeader />

            <MyProfile
              profileImage={userInfo?.profileImageUrl}
              nickname={userInfo?.nickname}
              onPress={onProfilePress}
            />

            <MyScrapSummary
              className="mt-6"
              blogScrapCount={userInfo?.blogScrapCnt ?? 0}
              youtubeScrapCount={userInfo?.youtubeScrapCnt ?? 0}
              recipeScrapCount={userInfo?.recipeScrapCnt ?? 0}
            />

            <MyRecipeSummary
              recipes={userInfo?.userRecipeSummaries ?? []}
              className="mt-10 flex-1"
            />
          </ScrollView>

          <CreateRecipeButton />
        </View>
      )}
    </SafeAreaView>
  );
}
