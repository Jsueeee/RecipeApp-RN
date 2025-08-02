import { PressableScale } from "@/app/components/PressableScale";
import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import { useDefaultBottomSheetModal } from "@/app/hooks/useDefaultBottomSheetModal";
import ProfileImageEditIcon from "@/assets/images/ic_profile_image_edit.svg";
import NicknameEditIcon from "@/assets/images/ic_profile_nickname_edit.svg";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";
import EditProfileImageBottomSheet from "./components/EditProfileImageBottomSheet";
import EditProfileNicknameBottomSheet from "./components/EditProfileNicknameBottomSheet";

export default function MyProfileScreen() {
  const { userInfo } = useUserInfoQuery();

  const { ref: profileBottomSheetModalRef, open: openProfileBottomSheetModal } =
    useDefaultBottomSheetModal();

  const {
    ref: nicknameBottomSheetModalRef,
    open: openNicknameBottomSheetModal,
  } = useDefaultBottomSheetModal();

  const onProfileImageEditButtonPress = () => {
    openProfileBottomSheetModal();
  };

  const onNicknameEditButtonPress = () => {
    openNicknameBottomSheetModal();
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

  const loginProviderIcon = useMemo(() => {
    switch (userInfo?.loginProvider.toLowerCase()) {
      case "kakao":
        return (
          <Image
            source={require("@/assets/images/ic_login_kakao.png")}
            className="w-[18px] h-[18px]"
          />
        );
      case "naver":
        return (
          <Image
            source={require("@/assets/images/ic_login_naver.png")}
            className="w-[18px] h-[18px]"
          />
        );
      case "google":
        return (
          <Image
            source={require("@/assets/images/ic_login_google.png")}
            className="w-[18px] h-[18px]"
          />
        );
    }
  }, [userInfo?.loginProvider]);

  return (
    <ScreenLayout
      title={i18n.t("profile.title")}
      backgroundColor="background-alternative"
      isScrollEnabled={true}
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

      <View className="w-full flex-row items-center px-4 mt-7">
        <Text className="text-title5 text-text-normal mr-[34px]">
          {i18n.t("profile.loginProvider")}
        </Text>

        {loginProviderIcon}
        <Text className="text-body2 text-text-strong ml-1.5">
          {loginProviderText}
        </Text>
      </View>

      <EditProfileImageBottomSheet
        bottomSheetModalRef={profileBottomSheetModalRef}
        currentImageUrl={userInfo?.profileImageUrl}
        currentNickname={userInfo?.nickname ?? ""}
      />

      {userInfo && (
        <EditProfileNicknameBottomSheet
          bottomSheetModalRef={nicknameBottomSheetModalRef}
          currentImageUrl={userInfo?.profileImageUrl ?? ""}
          currentNickname={userInfo?.nickname ?? ""}
        />
      )}
    </ScreenLayout>
  );
}
