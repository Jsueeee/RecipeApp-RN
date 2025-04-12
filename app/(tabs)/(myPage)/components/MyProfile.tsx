import { PressableScale } from "@/app/components/PressableScale";
import RightArrowIcon from "@/assets/images/ic_arrow_right.svg";
import React from "react";
import { Image, Text, View } from "react-native";

interface Props {
  profileImage?: string | undefined | null;
  nickname: string | undefined;
  onPress?: () => void;
}

export function MyProfile({
  profileImage,
  nickname,
  onPress = () => {},
}: Props) {
  return (
    <PressableScale onPress={onPress} className="flex-1 mx-4 mt-3">
      <View className="flex-row items-center">
        <Image
          source={{ uri: profileImage ?? "" }}
          className="w-12 h-12 rounded-[18px] bg-gray-50"
          resizeMode="cover"
        />

        <Text className="flex-1 ml-3 text-title4 text-text-strong">
          {nickname}
        </Text>

        <RightArrowIcon width={24} height={24} />
      </View>
    </PressableScale>
  );
}
