import IC_EDIT_FOOD_MINUS from "@/assets/images/ic_edit_food_minus.svg";
import IC_EDIT_FOOD_PLUS from "@/assets/images/ic_edit_food_plus.svg";
import i18n from "@/lib/i18n";
import { Pressable, Text, TextInput, View } from "react-native";

interface Props {
  quantity: number;
  onQuantityChanged: (value: number) => void;
}

export function EditQuantityMenu({ quantity, onQuantityChanged }: Props) {
  return (
    <View className="w-full flex-row items-center">
      <Text className="text-title5 text-text-alternative w-[100px] py-[18px]">
        {i18n.t("edit_food.menu_quantity")}
      </Text>

      <QuantityInput
        quantity={quantity}
        onQuantityChanged={onQuantityChanged}
      />
    </View>
  );
}

function QuantityInput({ quantity, onQuantityChanged }: Props) {
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
    <View className="flex-1 flex-row items-center justify-between">
      <Pressable onPress={handleDecrease} className="active:opacity-70">
        <IC_EDIT_FOOD_MINUS width={32} height={32} />
      </Pressable>

      <TextInput
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
        returnKeyType="done"
        selectTextOnFocus
        selectionColor="transparent"
        editable={true}
        caretHidden={true}
      />

      <Pressable onPress={handleIncrease} className="active:opacity-70">
        <IC_EDIT_FOOD_PLUS width={32} height={32} />
      </Pressable>
    </View>
  );
}
