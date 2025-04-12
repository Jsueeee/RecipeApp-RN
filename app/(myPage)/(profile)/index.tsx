import { PressableScale } from "@/app/components/PressableScale";
import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import ProfileImageEditIcon from "@/assets/images/ic_profile_image_edit.svg";
import NicknameEditIcon from "@/assets/images/ic_profile_nickname_edit.svg";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";

export default function MyProfileScreen() {
  const { data: userInfo } = useUserInfoQuery();

  const onProfileImageEditButtonPress = () => {
    console.log("profile image edit button pressed");
  };

  const onNicknameEditButtonPress = () => {
    console.log("nickname edit button pressed");
  };

  const loginProviderText = useMemo(() => {
    switch (userInfo?.loginProvider.toLowerCase()) {
      case "kakao":
        return i18n.t("profile.loginProviderKakao");
      case "naver":
        return i18n.t("profile.loginProviderNaver");
      case "google":
        return i18n.t("profile.loginProviderGoogle");
    }
  }, [userInfo?.loginProvider]);

  return (
    <ScreenLayout
      title={i18n.t("profile.title")}
      backgroundColor="background-alternative"
    >
      <View className="items-center justify-center gap-4 mt-3">
        <PressableScale onPress={onProfileImageEditButtonPress}>
          <Image
            source={{ uri: userInfo?.profileImageUrl ?? "" }}
            className="w-[100px] h-[100px] rounded-[36px] bg-gray-50"
          />
          <ProfileImageEditIcon
            width={32}
            height={32}
            style={{ position: "absolute", bottom: 0, right: -8 }}
          />
        </PressableScale>

        <PressableScale onPress={onNicknameEditButtonPress}>
          <View className="flex-row items-center justify-center gap-1 mx-4">
            <Text>{userInfo?.nickname}</Text>
            <NicknameEditIcon width={20} height={20} />
          </View>
        </PressableScale>
      </View>

      <View className="w-full flex-row items-center gap-[34px] px-4 mt-10">
        <Text className="text-title5 text-text-normal">
          {i18n.t("profile.email")}
        </Text>
        <Text className="text-body2 text-text-strong">
          {userInfo?.email ?? "-"}
        </Text>
      </View>

      <View className="w-full flex-row items-center gap-[34px] px-4 mt-7">
        <Text className="text-title5 text-text-normal">
          {i18n.t("profile.loginProvider")}
        </Text>
        <Text className="text-body2 text-text-strong">{loginProviderText}</Text>
      </View>
    </ScreenLayout>
  );
}
