import i18n from "@/lib/i18n";
import clsx from "clsx";
import { Image, Text, View } from "react-native";

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
  return (
    <View className={clsx("flex-row items-center gap-2", className)}>
      <Image
        source={{ uri: profileImage }}
        className="w-[30px] h-[30px] rounded-[8px] bg-gray-50"
        resizeMode="cover"
      />

      <Text className="text-title5">
        <Text className="text-text-normal">{nickname}</Text>
        <Text className="text-text-alternative">
          {i18n.t("recipe_detail.author_profile")}
        </Text>
      </Text>
    </View>
  );
};
