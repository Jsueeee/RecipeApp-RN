import i18n from "@/lib/i18n";
import { Text, TextInput, View } from "react-native";

interface Props {
  expiredAt: string | null | undefined;
  onExpiredAtChanged: (value: string) => void;
}

export function EditExpiredAtMenu({ expiredAt, onExpiredAtChanged }: Props) {
  return (
    <View className="w-full flex-row items-center">
      <Text className="text-title5 text-text-alternative w-[100px] py-[18px]">
        {i18n.t("edit_food.menu_expired")}
      </Text>

      <ExpiredAtInput
        expiredAt={expiredAt}
        onExpiredAtChanged={onExpiredAtChanged}
      />
    </View>
  );
}

function ExpiredAtInput({ expiredAt, onExpiredAtChanged }: Props) {
  return (
    <View className="flex-1 flex-row items-center justify-between">
      <TextInput
        value={expiredAt ?? ""}
        onChangeText={onExpiredAtChanged}
        className="flex-1 text-utility2 text-text-strong"
        keyboardType="numeric"
        returnKeyType="done"
        selectTextOnFocus
        selectionColor="transparent"
        editable={true}
        caretHidden={true}
        placeholder={i18n.t("edit_food.expired_hint")}
      />
    </View>
  );
}
