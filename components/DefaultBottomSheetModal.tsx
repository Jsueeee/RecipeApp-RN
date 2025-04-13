import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  children: React.ReactNode;
  title?: string;
}

/**
 * 앱 내에서 기본으로 사용할 바텀시트
 */
export default function DefaultBottomSheetModal({
  bottomSheetModalRef,
  children,
  title,
}: Props) {
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);

    if (index === -1) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, []);

  const onBackDropPress = () => {
    bottomSheetModalRef.current?.dismiss();
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
      backgroundStyle={{ backgroundColor: "white" }}
      handleComponent={null}
      enableDismissOnClose={true}
      enablePanDownToClose={true}
      backdropComponent={backdropComponent}
    >
      <BottomSheetView className="flex-1 pb-safe">
        <View className="justify-center items-center">
          {title && (
            <Text className="w-full text-center text-title4 text-text-strong p-4">
              {title}
            </Text>
          )}

          {children}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
