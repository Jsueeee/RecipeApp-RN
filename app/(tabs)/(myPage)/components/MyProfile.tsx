import { PressableScale } from "@/app/components/PressableScale";
import RightArrowIcon from "@/assets/images/ic_arrow_right.svg";
import {
  DEFAULT_PROFILE_AVATAR_SOURCE,
  getProfileAvatarSource,
} from "@/constants/ProfileAvatar";
import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";

interface Props {
  profileImage?: string | undefined | null;
  showGuestAvatar?: boolean;
  nickname: string | undefined;
  onPress?: () => void;
}

export function MyProfile({
  profileImage,
  showGuestAvatar = false,
  nickname,
  onPress = () => {},
}: Props) {
  const profileImageSource = useMemo(
    () => getProfileAvatarSource(profileImage),
    [profileImage],
  );

  return (
    <PressableScale onPress={onPress} className="mx-4 mt-3">
      <View className="flex-row items-center">
        {profileImageSource ? (
          <Image
            source={profileImageSource}
            className="w-12 h-12 rounded-[18px] bg-gray-50"
            resizeMode="cover"
          />
        ) : showGuestAvatar ? (
          <Image
            source={DEFAULT_PROFILE_AVATAR_SOURCE}
            className="w-12 h-12 rounded-[18px] bg-gray-50"
            resizeMode="cover"
          />
        ) : (
          <View className="w-12 h-12 rounded-[18px] bg-gray-50" />
        )}

        <Text className="flex-1 ml-3 text-title4 text-text-strong">
          {nickname}
        </Text>

        <RightArrowIcon width={24} height={24} color="#9FADA6" />
      </View>
    </PressableScale>
  );
}
