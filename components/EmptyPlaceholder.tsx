import IC_CRYING_ONION from "@/assets/images/ic_crying_onion.svg";
import i18n from "@/lib/i18n";
import { Text, View } from "react-native";

interface Props {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onClick?: () => void;
}

export function EmptyPlaceholder({
  title = i18n.t("home.fridge_is_empty"),
  description = i18n.t("home.fridge_is_empty_sub"),
  buttonLabel,
  onClick,
}: Props) {
  return (
    <View className="flex-1 items-center justify-center">
      <IC_CRYING_ONION width={80} height={80} />

      <Text className="text-title3 text-text-strong mt-4 text-center">
        {title}
      </Text>

      <Text className="text-body2 text-text-alternative mt-2 text-center">
        {description}
      </Text>

      {/* {buttonLabel && (
        <View className="mt-4">
          <AccentMediumDefaultButton // 이 컴포넌트도 별도 구현 필요
            text={buttonLabel}
            onPress={onClick}
          />
        </View>
      )} */}
    </View>
  );
}
