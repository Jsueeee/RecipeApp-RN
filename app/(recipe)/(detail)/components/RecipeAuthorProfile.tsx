import i18n from "@/lib/i18n";
import { getProfileAvatarSource } from "@/constants/ProfileAvatar";
import clsx from "clsx";
import { Image, Text, View } from "react-native";
import IC_TOMATO from "@/assets/images/ic_tomato.svg";

interface Props {
  profileImage: string | undefined;
  nickname: string | undefined;
  className?: string;
}

export const RecipeAuthorProfile = ({
  profileImage,
  nickname,
  className,
}: Props) => {
  const profileImageSource = getProfileAvatarSource(profileImage);

  return (
    <View className={clsx("flex-row items-center gap-2", className)}>
      <View className="w-[30px] h-[30px] items-center justify-center">
        {profileImageSource ? (
          <Image
            source={profileImageSource}
            className="w-[30px] h-[30px] rounded-[8px] bg-gray-50"
            resizeMode="cover"
          />
        ) : (
          <IC_TOMATO width={24} height={24} />
        )}
      </View>

      <Text className="text-title5 flex-1">
        <Text className="text-text-normal">
          {nickname ? nickname : i18n.t("app.name")}
        </Text>
        <Text className="text-text-alternative">
          {nickname
            ? i18n.t("recipe_detail.author_profile")
            : i18n.t("recipe_detail.author_profile_default")}
        </Text>
      </Text>
    </View>
  );
};
