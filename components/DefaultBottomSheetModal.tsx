import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);

    if (index === -1) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, []);

  const onBackDropPress = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: "white" }}
      handleComponent={null}
      enableDismissOnClose={true}
      enablePanDownToClose={true}
      backdropComponent={({ animatedIndex, style }) => (
        <Pressable onPress={onBackDropPress} style={style}>
          <Animated.View style={styles.backdrop} />
        </Pressable>
      )}
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
  contentContainer: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
