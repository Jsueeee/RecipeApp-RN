import { DebouncedPressable } from "@/app/components/DebouncedPressable";
import { Modal, Pressable, View } from "react-native";
import DateTimePicker, {
  DateType,
  useDefaultClassNames,
} from "react-native-ui-datepicker";

const MIN_EXPIRATION_DATE = new Date(2024, 0, 1);

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
      statusBarTranslucent={true}
    >
      <DebouncedPressable
        className="flex-1 justify-center bg-black/30"
        onPress={() => setShowPicker(false)}
      >
        <Pressable className="m-12" onPress={(e) => e.stopPropagation()}>
          <View className="p-5 justify-center bg-white rounded-[12px]">
            <DateTimePicker
              mode="single"
              date={expiredAt ?? new Date()}
              minDate={MIN_EXPIRATION_DATE}
              onChange={handleDateChange}
              locale="ko"
              classNames={{
                ...defaultClassNames,
                selected: "bg-teal-500 rounded-[6px] mx-0.5 my-2",
                selected_label:
                  "font-pretendard_medium text-[13px] leading-[18px] text-white",
                day_label: "text-body4",
                weekday_label: "text-body4",
                month_label: "text-body4",
                year_label: "text-body4",
                year_selector_label: "text-title5",
                month_selector_label: "text-title5",
                selected_year_label: "text-body4",
                selected_month_label: "text-body4",
              }}
            />
          </View>
        </Pressable>
      </DebouncedPressable>
    </Modal>
  );
}
