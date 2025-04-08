import CookingLevel1Icon from "@/assets/images/ic_cooking_level_1.svg";
import CookingLevel2Icon from "@/assets/images/ic_cooking_level_2.svg";
import CookingLevel3Icon from "@/assets/images/ic_cooking_level_3.svg";
import CookingTimeIcon from "@/assets/images/ic_cooking_time.svg";
import HeartFillIcon from "@/assets/images/ic_heart_fill.svg";
import i18n from "@/lib/i18n";
import clsx from "clsx";
import { Text, View } from "react-native";
import { SvgProps } from "react-native-svg";

interface Props {
  scrapCount: number;
  cookingTime: number | undefined;
  cookingLevel: string | undefined;
  className?: string;
}

const getCookingLevelIcon = (level: string) => {
  switch (level) {
    case "초보환영":
      return CookingLevel1Icon;
    case "보통":
      return CookingLevel2Icon;
    case "어려움":
      return CookingLevel3Icon;
    default:
      return CookingLevel1Icon;
  }
};

const InfoBox = ({
  text,
  Icon,
}: {
  text: string;
  Icon: React.FC<SvgProps>;
}) => (
  <View className="flex-1 items-center bg-fill-subtle rounded-[12px] py-3 gap-y-0.5">
    <Icon width={24} height={24} />
    <Text className="text-body4 text-text-alternative">{text}</Text>
  </View>
);

export const RecipeCookInfo: React.FC<Props> = ({
  scrapCount,
  cookingTime,
  cookingLevel,
  className,
}) => {
  const LevelIcon = getCookingLevelIcon(cookingLevel ?? "");

  return (
    <View className={clsx("flex-row gap-x-1.5", className)}>
      <InfoBox
        text={i18n.t("recipe_detail.scrap_count", {
          count: scrapCount,
        })}
        Icon={() => <HeartFillIcon width={20} height={20} color="#F3734F" />}
      />
      <InfoBox
        text={i18n.t("recipe_detail.cooking_time", {
          cookingTime: cookingTime ?? 0,
        })}
        Icon={CookingTimeIcon}
      />
      <InfoBox text={cookingLevel ?? ""} Icon={LevelIcon} />
    </View>
  );
};
