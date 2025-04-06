import IC_CRYING_ONION from "@/assets/images/ic_crying_onion.svg";
import i18n from "@/lib/i18n";
import { Text, View } from "react-native";
import { CTAButton } from "./CTAButton";

interface Props {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onPress?: () => void;
  className?: string;
}

export function EmptyPlaceholder({
  title = i18n.t("home.fridge_is_empty"),
  description = i18n.t("home.fridge_is_empty_sub"),
  buttonLabel,
  onPress,
  className = "",
}: Props) {
  return (
    <View className={`flex-1 items-center justify-center ${className}`}>
      <IC_CRYING_ONION width={80} height={80} />

      <Text className="text-title3 text-text-strong mt-4 text-center">
        {title}
      </Text>

      <Text className="text-body2 text-text-alternative mt-2 text-center">
        {description}
      </Text>

      {buttonLabel && (
        <CTAButton
          buttonLabel={buttonLabel}
          onPress={() => onPress?.()}
          className="mt-4"
        />
      )}
    </View>
  );
}
