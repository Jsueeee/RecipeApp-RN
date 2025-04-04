import i18n from "@/lib/i18n";
import { format } from "date-fns";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";
import { DatePicker } from "./DatePicker";
interface Props {
  expiredAt: Date | null | undefined;
  onExpiredAtChanged: (value: Date) => void;
}

export function EditExpiredAtMenu({ expiredAt, onExpiredAtChanged }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (params: { date: DateType }) => {
    if (params.date) {
      onExpiredAtChanged(params.date as Date);
      setShowPicker(false);
    }
  };

  return (
    <View className="w-full flex-row items-center">
      <Text className="text-title5 text-text-alternative w-[100px] py-[10px]">
        {i18n.t("edit_food.menu_expired")}
      </Text>

      <Pressable className="flex-1 py-2" onPress={() => setShowPicker(true)}>
        <Text className="text-utility2 text-text-alternative">
          {expiredAt
            ? format(new Date(expiredAt), "yyyy.MM.dd")
            : i18n.t("edit_food.expired_hint")}
        </Text>
      </Pressable>

      <DatePicker
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        expiredAt={expiredAt ?? new Date()}
        handleDateChange={handleDateChange}
      />
    </View>
  );
}
