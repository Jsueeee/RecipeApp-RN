import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  children: React.ReactNode;
  title?: string;
  onDismiss?: () => void;
  scrollEnabled?: boolean;
}

/**
 * 앱 내에서 기본으로 사용할 바텀시트
 */
export default function DefaultBottomSheetModal({
  bottomSheetModalRef,
  children,
  title,
  onDismiss,
  scrollEnabled = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        bottomSheetModalRef.current?.dismiss();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isOpen]);

  const handleSheetChanges = useCallback((index: number) => {
    setIsOpen(index !== -1);

    if (index === -1) {
      bottomSheetModalRef.current?.dismiss();
      Keyboard.dismiss();
      onDismiss?.();
    }
  }, []);

  const onBackDropPress = () => {
    bottomSheetModalRef.current?.dismiss();
    Keyboard.dismiss();
  };

  const backdropComponent = ({
    animatedIndex,
    style,
  }: BottomSheetBackdropProps) => (
    <Pressable onPress={onBackDropPress} style={[style, styles.backdrop]} />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      backgroundStyle={{
        backgroundColor: "white",
        borderRadius: 16,
      }}
      containerStyle={{
        marginHorizontal: 10,
        borderRadius: 16,
      }}
      handleComponent={null}
      enableDismissOnClose={true}
      enablePanDownToClose={true}
      backdropComponent={backdropComponent}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      bottomInset={insets.bottom}
    >
      <BottomSheetScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        scrollEnabled={scrollEnabled}
        nestedScrollEnabled={true}
      >
        <View className="justify-center items-center">
          {title && (
            <Text className="w-full text-center text-title4 text-text-strong p-4 mt-2">
              {title}
            </Text>
          )}
          {children}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
