import {
  convertDateString,
  toDateOnlyRequestString,
} from "@/app/utils/DateTimeUtils";
import i18n from "@/lib/i18n";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";
import { DatePicker } from "./DatePicker";
interface Props {
  expiredAt: string | null | undefined;
  onExpiredAtChanged: (value: string) => void;
}

export function EditExpiredAtMenu({ expiredAt, onExpiredAtChanged }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const dateOnlyExpiredAt = toDateOnlyRequestString(expiredAt);

  const handleDateChange = (params: { date: DateType }) => {
    onExpiredAtChanged(toDateOnlyRequestString(params.date) ?? "");
    setShowPicker(false);
  };

  return (
    <View className="w-full flex-row items-center">
      <Text className="text-title5 text-text-alternative w-[100px] py-[10px]">
        {i18n.t("edit_food.menu_expired")}
      </Text>

      <Pressable className="flex-1 py-2" onPress={() => setShowPicker(true)}>
        <Text className="text-utility2 text-text-alternative">
          {expiredAt
            ? convertDateString(expiredAt)
            : i18n.t("edit_food.expired_hint")}
        </Text>
      </Pressable>

      <DatePicker
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        expiredAt={
          dateOnlyExpiredAt ? new Date(`${dateOnlyExpiredAt}T00:00:00`) : new Date()
        }
        handleDateChange={handleDateChange}
      />
    </View>
  );
}
