import { DebouncedPressable } from "@/app/components/DebouncedPressable";
import IC_EDIT_FOOD_MINUS from "@/assets/images/ic_edit_food_minus.svg";
import IC_EDIT_FOOD_PLUS from "@/assets/images/ic_edit_food_plus.svg";
import i18n from "@/lib/i18n";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Platform, Text, TextInput, View } from "react-native";

interface Props {
  quantity: number;
  onQuantityChanged: (value: number) => void;
}

interface QuantityInputProps extends Props {
  isBottomSheet?: boolean;
  onFocus?: () => void;
}

export function EditQuantityMenu({ quantity, onQuantityChanged }: Props) {
  return (
    <View className="w-full flex-column">
      <View className="w-full flex-row items-center">
        <Text className="text-title5 text-text-alternative w-[100px]">
          {i18n.t("edit_food.menu_quantity")}
        </Text>

        <QuantityInput
          quantity={quantity}
          onQuantityChanged={onQuantityChanged}
        />
      </View>

      {quantity <= 0 && (
        <Text className="text-body3 text-strong-destructive ms-[100px]">
          {i18n.t("edit_food.quantity_error")}
        </Text>
      )}
    </View>
  );
}

export const QuantityInput = ({
  quantity,
  onQuantityChanged,
  isBottomSheet = false,
  onFocus,
}: QuantityInputProps) => {
  const Input = isBottomSheet ? BottomSheetTextInput : TextInput;

  const handleDecrease = () => {
    if (quantity > 0.5) {
      const updateQuantity = quantity - 0.5;
      onQuantityChanged(updateQuantity);
    }
  };

  const handleIncrease = () => {
    const updateQuantity = quantity + 0.5;
    onQuantityChanged(updateQuantity);
  };
  return (
    <View className="w-[150px] flex-row py-[12px] items-center justify-between">
      <DebouncedPressable onPress={handleDecrease} className="active:opacity-70">
        <IC_EDIT_FOOD_MINUS width={32} height={32} />
      </DebouncedPressable>

      <Input
        value={quantity.toString()}
        onChangeText={(text) => {
          if (text === "") {
            onQuantityChanged(0);
          } else {
            const num = parseFloat(text);
            if (!isNaN(num)) {
              onQuantityChanged(num);
            }
          }
        }}
        className="flex-1 text-center text-utility2 text-text-strong"
        keyboardType="numeric"
        returnKeyType={
          isBottomSheet && Platform.OS === "ios" ? "default" : "done"
        }
        onFocus={onFocus}
        selectTextOnFocus
        selectionColor="transparent"
        editable={true}
        caretHidden={true}
        textAlign="center"
        style={{
          transform: [{ translateY: Platform.OS === "ios" ? -4 : 0 }], // TODO : ios 수평 안맞는 문제 보기
        }}
      />

      <DebouncedPressable onPress={handleIncrease} className="active:opacity-70">
        <IC_EDIT_FOOD_PLUS width={32} height={32} />
      </DebouncedPressable>
    </View>
  );
};
