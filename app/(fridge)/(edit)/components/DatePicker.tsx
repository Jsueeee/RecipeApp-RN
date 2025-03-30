import { Pressable } from "react-native";
import { Modal } from "react-native";
import { View } from "react-native";
import DateTimePicker, { DateType, useDefaultClassNames } from "react-native-ui-datepicker";

interface Props {
  showPicker: boolean;
  setShowPicker: (showPicker: boolean) => void;
  expiredAt: Date;
  handleDateChange: (params: { date: DateType }) => void;
}

export function DatePicker({
  showPicker,
  setShowPicker,
  expiredAt,
  handleDateChange,
}: Props) {
  const defaultClassNames = useDefaultClassNames();

  return (
    <Modal
      visible={showPicker}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowPicker(false)}
    >
      <Pressable
        className="flex-1 justify-center bg-black/30"
        onPress={() => setShowPicker(false)}
      >
        <Pressable className="m-12" onPress={(e) => e.stopPropagation()}>
          <View className="p-5 justify-center bg-white rounded-[12px]">
            <DateTimePicker
              mode="single"
              date={expiredAt ?? new Date()}
              onChange={handleDateChange}
              locale="ko"
              classNames={{
                ...defaultClassNames,
                selected: "bg-teal-500 rounded-[6px]",
                selected_label: "text-white",
              }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
